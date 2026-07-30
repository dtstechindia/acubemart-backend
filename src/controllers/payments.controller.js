import crypto from "crypto";
import mongoose from "mongoose";
import Razorpay from "razorpay";

import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";
import Address from "../models/address.model.js";
import Order from "../models/order.model.js";
import PaymentAttempt from "../models/paymentattempt.model.js";
import Product from "../models/product.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import Variant from "../models/variant.model.js";
import { getOrderNumber } from "../utils/order.counter.js";

const ATTEMPT_STATUS = {
  CREATED: "created",
  PROCESSING: "processing",
  PAID: "paid",
  COMPLETED: "completed",
  FAILED: "failed",
};
const FINALIZATION_LEASE_MS = 60 * 1000;
const PROCESSING_WAIT_MS = 5 * 1000;
const PROCESSING_POLL_MS = 250;

const getRazorpayClient = () =>
  new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });

const getPaymentMode = (paymentOption) =>
  paymentOption === "prepaid" || paymentOption === "advance" ? "UPI" : "COD";

const normalizeAddress = (address = {}) => ({
  street: address.street,
  city: address.city,
  state: address.state,
  pincode: address.pincode,
  district: address.district,
  country: address.country || "India",
});

const safelyCompareSignatures = (expectedValue, actualValue) => {
  if (!expectedValue || !actualValue) {
    return false;
  }

  const expectedBuffer = Buffer.from(expectedValue);
  const actualBuffer = Buffer.from(actualValue);

  if (expectedBuffer.length !== actualBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, actualBuffer);
};

const buildOrderData = (attempt, order, transaction) => ({
  userData: {
    _id: attempt.userId,
    firstName: attempt.customer?.firstName,
    lastName: attempt.customer?.lastName,
    email: attempt.customer?.email,
    phoneNumber: attempt.customer?.phoneNumber,
    shippingAddress: attempt.shippingAddress,
    billingAddress: attempt.billingAddress,
  },
  products: attempt.products,
  address: attempt.addressId,
  phone: attempt.customer?.phoneNumber,
  couponId: attempt.couponId,
  transactionId: attempt.transactionId,
  transaction,
  total: attempt.amount,
  subtotal: attempt.subtotal,
  codCharges: attempt.codCharges,
  totalDiscount: attempt.totalDiscount,
  pendingAmount: attempt.pendingAmount,
  orderNumber: order.orderNumber,
});

const validateCreatePaymentPayload = (body) => {
  const { amount, currency, user, products, paymentOption, deliveryOption } = body;

  if (!user?._id) {
    return "User ID is required to start payment";
  }

  if (!Array.isArray(products) || products.length === 0) {
    return "At least one product is required to start payment";
  }

  if (!amount || amount <= 0) {
    return "Valid order amount is required";
  }

  if (!currency) {
    return "Currency is required";
  }

  if (!paymentOption || !["prepaid", "advance"].includes(paymentOption)) {
    return "A valid prepaid payment option is required";
  }

  if (!deliveryOption) {
    return "Delivery option is required";
  }

  if (!user?.shippingAddress?.street || !user?.shippingAddress?.city || !user?.shippingAddress?.state || !user?.shippingAddress?.pincode) {
    return "A complete shipping address is required";
  }

  if (!user?.phoneNumber) {
    return "Phone number is required";
  }

  return null;
};

const verifyPaymentSignature = (razorpayOrderId, razorpayPaymentId, razorpaySignature) => {
  const payload = `${razorpayOrderId}|${razorpayPaymentId}`;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(payload)
    .digest("hex");

  return safelyCompareSignatures(expectedSignature, razorpaySignature);
};

const findCompletedAttempt = async (attemptId) => {
  const attempt = await PaymentAttempt.findById(attemptId);
  if (!attempt) return null;

  const order = attempt.orderId
    ? await Order.findById(attempt.orderId)
    : await Order.findOne({ paymentAttemptId: attempt._id });
  if (!order) return null;

  if (!attempt.orderId || attempt.status !== ATTEMPT_STATUS.COMPLETED) {
    attempt.orderId = order._id;
    attempt.orderNumber = order.orderNumber;
    attempt.status = ATTEMPT_STATUS.COMPLETED;
    attempt.completedAt ||= order.createdAt || new Date();
    attempt.processingStartedAt = undefined;
    await attempt.save();
  }

  return { attempt, order, alreadyCompleted: true };
};

const waitForAttemptCompletion = async (attemptId) => {
  const deadline = Date.now() + PROCESSING_WAIT_MS;

  while (Date.now() < deadline) {
    const completed = await findCompletedAttempt(attemptId);
    if (completed) return completed;

    const latestAttempt = await PaymentAttempt.findById(attemptId).select(
      "status processingStartedAt"
    );
    if (!latestAttempt || latestAttempt.status !== ATTEMPT_STATUS.PROCESSING) {
      return null;
    }

    await new Promise((resolve) => setTimeout(resolve, PROCESSING_POLL_MS));
  }

  return null;
};

const reserveAttemptForProcessing = async ({
  attemptId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  source,
}) => {
  const existingAttempt = attemptId
    ? await PaymentAttempt.findById(attemptId)
    : await PaymentAttempt.findOne({ razorpayOrderId });

  if (!existingAttempt) {
    throw apiErrorHandler(404, "Payment attempt not found");
  }

  const completedAttempt = await findCompletedAttempt(existingAttempt._id);
  if (completedAttempt) {
    return completedAttempt;
  }

  const leaseCutoff = new Date(Date.now() - FINALIZATION_LEASE_MS);
  const hasActiveLease =
    existingAttempt.status === ATTEMPT_STATUS.PROCESSING &&
    existingAttempt.processingStartedAt &&
    existingAttempt.processingStartedAt > leaseCutoff;

  if (hasActiveLease) {
    const completedWhileWaiting = await waitForAttemptCompletion(existingAttempt._id);
    if (completedWhileWaiting) return completedWhileWaiting;
  }

  const processingStartedAt = new Date();
  const attempt = await PaymentAttempt.findOneAndUpdate(
    {
      _id: existingAttempt._id,
      $or: [
        {
          status: {
            $in: [ATTEMPT_STATUS.CREATED, ATTEMPT_STATUS.FAILED, ATTEMPT_STATUS.PAID],
          },
        },
        {
          status: ATTEMPT_STATUS.PROCESSING,
          processingStartedAt: { $lte: leaseCutoff },
        },
        {
          status: ATTEMPT_STATUS.PROCESSING,
          processingStartedAt: { $exists: false },
        },
      ],
    },
    {
      $set: {
        status: ATTEMPT_STATUS.PROCESSING,
        processingStartedAt,
        lastFinalizationAt: processingStartedAt,
        razorpayOrderId: razorpayOrderId || existingAttempt.razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || existingAttempt.razorpayPaymentId,
        razorpaySignature: razorpaySignature || existingAttempt.razorpaySignature,
        lastEventSource: source,
        lastError: null,
        lastErrorStage: null,
        paidAt: existingAttempt.paidAt || (razorpayPaymentId ? new Date() : undefined),
      },
      $inc: { finalizationAttempts: 1 },
    },
    { new: true }
  );

  if (!attempt) {
    const completedAfterConflict = await waitForAttemptCompletion(existingAttempt._id);
    if (completedAfterConflict) return completedAfterConflict;

    throw apiErrorHandler(
      409,
      "Payment is still being processed. The order will be recovered automatically."
    );
  }

  return { attempt, alreadyCompleted: false };
};

const ensureAddress = async (attempt, session) => {
  if (attempt.addressId) {
    const existingAddress = await Address.findById(attempt.addressId).session(session);
    if (existingAddress) {
      return existingAddress;
    }
  }

  const [address] = await Address.create(
    [{
      ...normalizeAddress(attempt.shippingAddress),
      userId: attempt.userId,
    }],
    { session }
  );

  await User.findByIdAndUpdate(attempt.userId, {
    $addToSet: { address: address._id },
  }, { session });

  await PaymentAttempt.findByIdAndUpdate(attempt._id, {
    $set: { addressId: address._id },
  }, { session });

  return address;
};

const ensureTransaction = async (attempt, session) => {
  if (attempt.transactionId) {
    const existingTransaction = await Transaction.findById(
      attempt.transactionId
    ).session(session);
    if (existingTransaction) {
      return existingTransaction;
    }
  }

  const providerTransaction = attempt.razorpayPaymentId
    ? await Transaction.findOne({
        providerPaymentId: attempt.razorpayPaymentId,
      }).session(session)
    : null;
  if (providerTransaction) {
    await PaymentAttempt.findByIdAndUpdate(attempt._id, {
      $set: { transactionId: providerTransaction._id },
    }, { session });
    return providerTransaction;
  }

  const [transaction] = await Transaction.create(
    [{
      userId: attempt.userId,
      amount: attempt.amount,
      paymentMode: getPaymentMode(attempt.paymentOption),
      status: "SUCCESS",
      providerPaymentId: attempt.razorpayPaymentId,
      providerOrderId: attempt.razorpayOrderId,
    }],
    { session }
  );

  await PaymentAttempt.findByIdAndUpdate(attempt._id, {
    $set: { transactionId: transaction._id },
  }, { session });

  return transaction;
};

const validateInventoryAvailability = async (products) => {
  for (const item of products) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw apiErrorHandler(400, "Product quantity must be a positive whole number");
    }

    const availableItem = item.variantId
      ? await Variant.exists({
          _id: item.variantId,
          productId: item.productId,
          stock: { $gte: quantity },
        })
      : await Product.exists({
          _id: item.productId,
          stock: { $gte: quantity },
        });

    if (!availableItem) {
      throw apiErrorHandler(
        409,
        "A product in your cart is unavailable or has insufficient stock"
      );
    }
  }
};

const reserveInventory = async (products, session) => {
  for (const item of products) {
    const quantity = Number(item.quantity);
    if (!Number.isInteger(quantity) || quantity <= 0) {
      throw apiErrorHandler(400, "Product quantity must be a positive whole number");
    }

    const inventoryItem = item.variantId
      ? await Variant.findOneAndUpdate(
          {
            _id: item.variantId,
            productId: item.productId,
          },
          { $inc: { stock: -quantity } },
          { new: true, session }
        )
      : await Product.findOneAndUpdate(
          { _id: item.productId },
          { $inc: { stock: -quantity } },
          { new: true, session }
        );

    if (!inventoryItem) {
      throw apiErrorHandler(
        409,
        item.variantId
          ? "The selected product variant is no longer available"
          : "A product in your cart is no longer available"
      );
    }
  }
};

const createOrderFromAttempt = async (attempt, address, transaction, session) => {
  const existingOrder = await Order.findOne({
    paymentAttemptId: attempt._id,
  }).session(session);
  if (existingOrder) return existingOrder;

  const orderNumber = await getOrderNumber(session);
  const [order] = await Order.create(
    [{
      paymentAttemptId: attempt._id,
      userId: attempt.userId,
      products: attempt.products.map((product) => ({
        productId: product.productId,
        quantity: product.quantity,
        variantId: product.variantId,
      })),
      total: attempt.amount,
      address: address._id,
      phone: attempt.customer.phoneNumber,
      couponId: attempt.couponId,
      transactionId: transaction._id,
      orderNumber,
    }],
    { session }
  );

  await PaymentAttempt.findByIdAndUpdate(attempt._id, {
    $set: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: ATTEMPT_STATUS.COMPLETED,
      completedAt: new Date(),
    },
    $unset: { processingStartedAt: 1 },
  }, { session });

  await Promise.all([
    User.findByIdAndUpdate(attempt.userId, {
      $addToSet: { orders: order._id },
    }, { session }),
    Transaction.findByIdAndUpdate(transaction._id, {
      $set: { orderId: order._id },
    }, { session }),
  ]);

  return order;
};

const finalizeAttempt = async ({
  attemptId,
  razorpayOrderId,
  razorpayPaymentId,
  razorpaySignature,
  source,
}) => {
  const reservation = await reserveAttemptForProcessing({
    attemptId,
    razorpayOrderId,
    razorpayPaymentId,
    razorpaySignature,
    source,
  });

  if (reservation.alreadyCompleted) {
    return {
      attempt: reservation.attempt,
      order: reservation.order,
      alreadyCompleted: true,
    };
  }

  const { attempt } = reservation;
  const session = await mongoose.startSession();
  let finalizationStage = "starting transaction";
  let order;

  try {
    await session.withTransaction(async () => {
      const transactionalAttempt = await PaymentAttempt.findById(
        attempt._id
      ).session(session);
      if (!transactionalAttempt) {
        throw apiErrorHandler(404, "Payment attempt not found during finalization");
      }

      finalizationStage = "reserving inventory";
      await reserveInventory(transactionalAttempt.products, session);
      finalizationStage = "saving address";
      const address = await ensureAddress(transactionalAttempt, session);
      finalizationStage = "saving transaction";
      const transaction = await ensureTransaction(transactionalAttempt, session);
      finalizationStage = "creating order";
      order = await createOrderFromAttempt(
        transactionalAttempt,
        address,
        transaction,
        session
      );
    });

    const refreshedAttempt = await PaymentAttempt.findById(attempt._id);

    return {
      attempt: refreshedAttempt,
      order,
      alreadyCompleted: false,
    };
  } catch (error) {
    const completedAfterError = await findCompletedAttempt(attempt._id);
    if (completedAfterError) {
      return completedAfterError;
    }

    await PaymentAttempt.findByIdAndUpdate(attempt._id, {
      $set: {
        status: ATTEMPT_STATUS.FAILED,
        lastError: error.message || "Failed to finalize payment attempt",
        lastErrorStage: finalizationStage,
        razorpayPaymentId: razorpayPaymentId || attempt.razorpayPaymentId,
        razorpaySignature: razorpaySignature || attempt.razorpaySignature,
        lastEventSource: source,
      },
      $unset: { processingStartedAt: 1 },
    });

    throw error;
  } finally {
    await session.endSession();
  }
};

const createPayment = async (req, res, next) => {
  const validationError = validateCreatePaymentPayload(req.body);

  if (validationError) {
    return next(apiErrorHandler(400, validationError));
  }

  const {
    amount,
    currency,
    user,
    products,
    subtotal,
    codCharges,
    totalDiscount,
    pendingAmount,
    paymentOption,
    deliveryOption,
    couponId,
  } = req.body;

  let paymentAttempt;

  try {
    await validateInventoryAvailability(products);

    paymentAttempt = await PaymentAttempt.create({
      userId: user._id,
      products,
      shippingAddress: normalizeAddress(user.shippingAddress),
      billingAddress: normalizeAddress(user.billingAddress || user.shippingAddress),
      customer: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber,
      },
      amount,
      subtotal,
      codCharges,
      totalDiscount,
      pendingAmount,
      currency,
      couponId,
      paymentOption,
      deliveryOption,
      status: ATTEMPT_STATUS.CREATED,
    });

    const receipt = paymentAttempt._id.toString();
    const order = await getRazorpayClient().orders.create({
      amount: Math.round(amount * 100),
      currency,
      receipt,
      notes: {
        checkoutAttemptId: receipt,
        userId: user._id.toString(),
        paymentOption,
      },
    });

    paymentAttempt.razorpayOrderId = order.id;
    paymentAttempt.receipt = receipt;
    await paymentAttempt.save();

    return res.json({
      ...order,
      checkoutAttemptId: paymentAttempt._id,
    });
  } catch (error) {
    if (paymentAttempt?._id) {
      await PaymentAttempt.findByIdAndUpdate(paymentAttempt._id, {
        $set: {
          status: ATTEMPT_STATUS.FAILED,
          lastError: error.message || "Failed to create Razorpay order",
        },
      });
    }

    return next(error);
  }
};

const verifyPaymentAndCreateOrder = async (req, res, next) => {
  const {
    checkoutAttemptId,
    razorpay_order_id: razorpayOrderId,
    razorpay_payment_id: razorpayPaymentId,
    razorpay_signature: razorpaySignature,
  } = req.body;

  if (!checkoutAttemptId || !razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
    return next(apiErrorHandler(400, "Payment verification payload is incomplete"));
  }

  try {
    const attempt = await PaymentAttempt.findById(checkoutAttemptId);
    if (!attempt) {
      return next(apiErrorHandler(404, "Payment attempt not found"));
    }

    if (attempt.razorpayOrderId !== razorpayOrderId) {
      return next(apiErrorHandler(400, "Razorpay order mismatch"));
    }

    if (!verifyPaymentSignature(razorpayOrderId, razorpayPaymentId, razorpaySignature)) {
      await PaymentAttempt.findByIdAndUpdate(checkoutAttemptId, {
        $set: {
          status: ATTEMPT_STATUS.FAILED,
          lastError: "Invalid Razorpay payment signature",
          razorpayPaymentId: razorpayPaymentId,
          razorpaySignature: razorpaySignature,
          lastEventSource: "frontend",
        },
      });

      return next(apiErrorHandler(400, "Payment signature verification failed"));
    }

    const { attempt: finalizedAttempt, order, alreadyCompleted } = await finalizeAttempt({
      attemptId: checkoutAttemptId,
      razorpayOrderId,
      razorpayPaymentId,
      razorpaySignature,
      source: "frontend",
    });
    const transaction = finalizedAttempt?.transactionId
      ? await Transaction.findById(finalizedAttempt.transactionId)
      : null;

    return res.status(alreadyCompleted ? 200 : 201).json({
      success: true,
      message: alreadyCompleted
        ? "Payment already verified and order already created"
        : "Payment verified and order created successfully",
      data: {
        order,
        orderData: buildOrderData(finalizedAttempt, order, transaction),
        paymentAttemptId: finalizedAttempt._id,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const recoverCapturedPayment = async (req, res, next) => {
  const {
    checkoutAttemptId,
    razorpay_payment_id: razorpayPaymentId,
  } = req.body;

  if (!checkoutAttemptId || !razorpayPaymentId) {
    return next(
      apiErrorHandler(
        400,
        "Checkout attempt ID and Razorpay payment ID are required"
      )
    );
  }

  try {
    const attempt = await PaymentAttempt.findById(checkoutAttemptId);
    if (!attempt) {
      return next(apiErrorHandler(404, "Payment attempt not found"));
    }

    if (
      attempt.razorpayPaymentId &&
      attempt.razorpayPaymentId !== razorpayPaymentId
    ) {
      return next(apiErrorHandler(400, "Payment ID does not match this checkout"));
    }

    const payment = await getRazorpayClient().payments.fetch(razorpayPaymentId);
    if (
      payment.status !== "captured" ||
      payment.captured !== true ||
      payment.order_id !== attempt.razorpayOrderId
    ) {
      return next(
        apiErrorHandler(409, "Razorpay has not confirmed this payment as captured")
      );
    }

    if (
      Number(payment.amount) !== Math.round(Number(attempt.amount) * 100) ||
      payment.currency !== attempt.currency
    ) {
      return next(
        apiErrorHandler(400, "Captured payment amount does not match this checkout")
      );
    }

    const providerAttemptId =
      payment.notes?.checkoutAttemptId ||
      payment.notes?.checkout_attempt_id;
    if (
      providerAttemptId &&
      providerAttemptId.toString() !== attempt._id.toString()
    ) {
      return next(
        apiErrorHandler(400, "Razorpay payment metadata does not match this checkout")
      );
    }

    const {
      attempt: finalizedAttempt,
      order,
      alreadyCompleted,
    } = await finalizeAttempt({
      attemptId: attempt._id,
      razorpayOrderId: payment.order_id,
      razorpayPaymentId: payment.id,
      source: "reconciliation",
    });
    const transaction = finalizedAttempt?.transactionId
      ? await Transaction.findById(finalizedAttempt.transactionId)
      : null;

    return res.status(alreadyCompleted ? 200 : 201).json({
      success: true,
      message: alreadyCompleted
        ? "Paid order was already recovered"
        : "Captured payment recovered and order created successfully",
      data: {
        order,
        orderData: buildOrderData(finalizedAttempt, order, transaction),
        paymentAttemptId: finalizedAttempt._id,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const handlePaymentWebhook = async (req, res, next) => {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret) {
    return next(apiErrorHandler(503, "Razorpay webhook secret is not configured"));
  }

  try {
    const rawBody = req.body instanceof Buffer ? req.body : Buffer.from(JSON.stringify(req.body));
    const signature = req.headers["x-razorpay-signature"];

    if (!signature || Array.isArray(signature)) {
      return next(apiErrorHandler(400, "Missing webhook signature"));
    }

    const expectedSignature = crypto
      .createHmac("sha256", webhookSecret)
      .update(rawBody)
      .digest("hex");

    if (!safelyCompareSignatures(expectedSignature, signature)) {
      return next(apiErrorHandler(400, "Invalid webhook signature"));
    }

    const payload = JSON.parse(rawBody.toString("utf8"));
    const event = payload.event;
    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;

    if (event === "payment.failed") {
      const razorpayOrderId = paymentEntity?.order_id;
      const attemptReceipt = paymentEntity?.notes?.checkoutAttemptId;
      const attemptQuery = attemptReceipt
        ? { _id: attemptReceipt }
        : { razorpayOrderId };

      if (attemptReceipt || razorpayOrderId) {
        await PaymentAttempt.findOneAndUpdate(
          { ...attemptQuery, status: { $ne: ATTEMPT_STATUS.COMPLETED } },
          {
            $set: {
              status: ATTEMPT_STATUS.FAILED,
              razorpayPaymentId: paymentEntity?.id,
              lastEventSource: "webhook",
              lastError: paymentEntity?.error_description || "Payment failed at Razorpay checkout",
              providerError: {
                code: paymentEntity?.error_code,
                description: paymentEntity?.error_description,
                source: paymentEntity?.error_source,
                step: paymentEntity?.error_step,
                reason: paymentEntity?.error_reason,
              },
            },
          }
        );
      }

      return res.status(200).json({ success: true, message: "Payment failure recorded" });
    }

    if (event !== "payment.captured" && event !== "order.paid") {
      return res.status(200).json({ success: true, message: "Webhook ignored" });
    }

    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    let razorpayPaymentId = paymentEntity?.id;
    if (!razorpayPaymentId && razorpayOrderId) {
      const providerPayments = await getRazorpayClient().orders.fetchPayments(
        razorpayOrderId
      );
      const capturedPayment = providerPayments.items?.find(
        (payment) => payment.status === "captured" && payment.captured === true
      );
      razorpayPaymentId = capturedPayment?.id;
    }
    const attemptReceipt =
      orderEntity?.notes?.checkoutAttemptId ||
      paymentEntity?.notes?.checkoutAttemptId ||
      orderEntity?.receipt;

    if ((!attemptReceipt && !razorpayOrderId) || !razorpayPaymentId) {
      return res.status(200).json({ success: true, message: "No matching attempt metadata found" });
    }

    await finalizeAttempt({
      attemptId: attemptReceipt,
      razorpayOrderId,
      razorpayPaymentId,
      source: "webhook",
    });

    return res.status(200).json({ success: true, message: "Webhook processed" });
  } catch (error) {
    return next(error);
  }
};

export {
  createPayment,
  verifyPaymentAndCreateOrder,
  recoverCapturedPayment,
  handlePaymentWebhook,
  finalizeAttempt as finalizePaymentAttempt,
};
