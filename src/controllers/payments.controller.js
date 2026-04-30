import crypto from "crypto";
import Razorpay from "razorpay";

import { apiErrorHandler } from "../middlewares/errorhandler.middleware.js";
import Address from "../models/address.model.js";
import Order from "../models/order.model.js";
import PaymentAttempt from "../models/paymentattempt.model.js";
import Product from "../models/product.model.js";
import Transaction from "../models/transaction.model.js";
import User from "../models/user.model.js";
import { getOrderNumber } from "../utils/order.counter.js";

const ATTEMPT_STATUS = {
  CREATED: "created",
  PROCESSING: "processing",
  PAID: "paid",
  COMPLETED: "completed",
  FAILED: "failed",
};

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

  if (existingAttempt.orderId) {
    const existingOrder = await Order.findById(existingAttempt.orderId);
    if (existingOrder) {
      return { attempt: existingAttempt, order: existingOrder, alreadyCompleted: true };
    }
  }

  const attempt = await PaymentAttempt.findOneAndUpdate(
    {
      _id: existingAttempt._id,
      status: {
        $in: [ATTEMPT_STATUS.CREATED, ATTEMPT_STATUS.FAILED, ATTEMPT_STATUS.PAID],
      },
    },
    {
      $set: {
        status: ATTEMPT_STATUS.PROCESSING,
        razorpayOrderId: razorpayOrderId || existingAttempt.razorpayOrderId,
        razorpayPaymentId: razorpayPaymentId || existingAttempt.razorpayPaymentId,
        razorpaySignature: razorpaySignature || existingAttempt.razorpaySignature,
        lastEventSource: source,
        lastError: null,
        paidAt: existingAttempt.paidAt || (razorpayPaymentId ? new Date() : undefined),
      },
    },
    { new: true }
  );

  if (!attempt) {
    const latestAttempt = await PaymentAttempt.findById(existingAttempt._id);
    if (latestAttempt?.orderId) {
      const existingOrder = await Order.findById(latestAttempt.orderId);
      if (existingOrder) {
        return { attempt: latestAttempt, order: existingOrder, alreadyCompleted: true };
      }
    }

    throw apiErrorHandler(409, "Payment is already being processed");
  }

  return { attempt, alreadyCompleted: false };
};

const ensureAddress = async (attempt) => {
  if (attempt.addressId) {
    const existingAddress = await Address.findById(attempt.addressId);
    if (existingAddress) {
      return existingAddress;
    }
  }

  const address = await Address.create({
    ...normalizeAddress(attempt.shippingAddress),
    userId: attempt.userId,
  });

  await User.findByIdAndUpdate(attempt.userId, {
    $addToSet: { address: address._id },
  });

  await PaymentAttempt.findByIdAndUpdate(attempt._id, {
    $set: { addressId: address._id },
  });

  return address;
};

const ensureTransaction = async (attempt) => {
  if (attempt.transactionId) {
    const existingTransaction = await Transaction.findById(attempt.transactionId);
    if (existingTransaction) {
      return existingTransaction;
    }
  }

  const transaction = await Transaction.create({
    userId: attempt.userId,
    amount: attempt.amount,
    paymentMode: getPaymentMode(attempt.paymentOption),
    status: "SUCCESS",
  });

  await PaymentAttempt.findByIdAndUpdate(attempt._id, {
    $set: { transactionId: transaction._id },
  });

  return transaction;
};

const createOrderFromAttempt = async (attempt, address, transaction) => {
  const orderNumber = await getOrderNumber();
  const order = await Order.create({
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
  });

  await User.findByIdAndUpdate(attempt.userId, {
    $addToSet: { orders: order._id },
  });

  await Transaction.findByIdAndUpdate(transaction._id, {
    $set: { orderId: order._id },
  });

  for (let index = 0; index < order.products.length; index += 1) {
    const orderProduct = order.products[index];
    const product = await Product.findById(orderProduct.productId);

    if (!product) {
      throw apiErrorHandler(404, "No Product Found");
    }

    if (product.stock < orderProduct.quantity) {
      throw apiErrorHandler(400, "Insufficient Stock");
    }

    product.stock -= orderProduct.quantity;
    await product.save();
  }

  await PaymentAttempt.findByIdAndUpdate(attempt._id, {
    $set: {
      orderId: order._id,
      orderNumber: order.orderNumber,
      status: ATTEMPT_STATUS.COMPLETED,
      completedAt: new Date(),
    },
  });

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

  try {
    const address = await ensureAddress(attempt);
    const transaction = await ensureTransaction(attempt);
    const order = await createOrderFromAttempt(attempt, address, transaction);
    const refreshedAttempt = await PaymentAttempt.findById(attempt._id);

    return {
      attempt: refreshedAttempt,
      order,
      alreadyCompleted: false,
    };
  } catch (error) {
    await PaymentAttempt.findByIdAndUpdate(attempt._id, {
      $set: {
        status: ATTEMPT_STATUS.FAILED,
        lastError: error.message || "Failed to finalize payment attempt",
        razorpayPaymentId: razorpayPaymentId || attempt.razorpayPaymentId,
        razorpaySignature: razorpaySignature || attempt.razorpaySignature,
        lastEventSource: source,
      },
    });

    throw error;
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

    if (event !== "payment.captured" && event !== "order.paid") {
      return res.status(200).json({ success: true, message: "Webhook ignored" });
    }

    const paymentEntity = payload.payload?.payment?.entity;
    const orderEntity = payload.payload?.order?.entity;
    const razorpayOrderId = paymentEntity?.order_id || orderEntity?.id;
    const razorpayPaymentId = paymentEntity?.id;
    const attemptReceipt =
      orderEntity?.notes?.checkoutAttemptId ||
      paymentEntity?.notes?.checkoutAttemptId ||
      orderEntity?.receipt;

    if (!attemptReceipt && !razorpayOrderId) {
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

export { createPayment, verifyPaymentAndCreateOrder, handlePaymentWebhook };
