import assert from "node:assert/strict";
import { after, afterEach, before, test } from "node:test";
import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";

import { finalizePaymentAttempt } from "../src/controllers/payments.controller.js";
import Address from "../src/models/address.model.js";
import Order from "../src/models/order.model.js";
import PaymentAttempt from "../src/models/paymentattempt.model.js";
import Product from "../src/models/product.model.js";
import Transaction from "../src/models/transaction.model.js";
import User from "../src/models/user.model.js";

let replSet;

const createCheckout = async (suffix) => {
  const user = await User.create({
    name: `Checkout Test ${suffix}`,
    email: `checkout-${suffix}@example.com`,
    phone: `999999${suffix.padStart(4, "0")}`,
  });
  const product = await Product.create({
    name: `Test Product ${suffix}`,
    price: 200,
    description: "Product used to verify atomic payment finalization.",
    stock: 10,
    slug: `test-product-${suffix}`,
    barcode: `barcode-${suffix}`,
    sku: `sku-${suffix}`,
    isSimpleProduct: true,
  });
  const attempt = await PaymentAttempt.create({
    userId: user._id,
    products: [
      {
        productId: product._id,
        quantity: 2,
        name: product.name,
        price: 200,
      },
    ],
    shippingAddress: {
      street: "1 Test Street",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110001",
    },
    billingAddress: {
      street: "1 Test Street",
      city: "New Delhi",
      state: "Delhi",
      country: "India",
      pincode: "110001",
    },
    customer: {
      firstName: "Checkout",
      lastName: "Test",
      email: `checkout-${suffix}@example.com`,
      phoneNumber: "9999999999",
    },
    amount: 190,
    subtotal: 200,
    totalDiscount: 10,
    currency: "INR",
    paymentOption: "prepaid",
    deliveryOption: "standard",
    razorpayOrderId: `order_${suffix}`,
    receipt: new mongoose.Types.ObjectId().toString(),
  });

  return { attempt, product };
};

before(async () => {
  replSet = await MongoMemoryReplSet.create({
    replSet: { count: 1, storageEngine: "wiredTiger" },
  });
  await mongoose.connect(replSet.getUri());
  await Promise.all(
    Object.values(mongoose.models).map((model) => model.init())
  );
});

afterEach(async () => {
  const collections = Object.values(mongoose.connection.collections);
  await Promise.all(collections.map((collection) => collection.deleteMany({})));
});

after(async () => {
  await mongoose.disconnect();
  await replSet.stop();
});

test("captured payment creates one complete order and repeated finalization is idempotent", async () => {
  const { attempt, product } = await createCheckout("1001");
  const paymentId = "pay_test_idempotent";

  const firstResult = await finalizePaymentAttempt({
    attemptId: attempt._id,
    razorpayOrderId: attempt.razorpayOrderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: "test-signature",
    source: "frontend",
  });
  const secondResult = await finalizePaymentAttempt({
    attemptId: attempt._id,
    razorpayOrderId: attempt.razorpayOrderId,
    razorpayPaymentId: paymentId,
    razorpaySignature: "test-signature",
    source: "reconciliation",
  });

  const [
    refreshedAttempt,
    refreshedProduct,
    orderCount,
    transactionCount,
    addressCount,
  ] = await Promise.all([
    PaymentAttempt.findById(attempt._id),
    Product.findById(product._id),
    Order.countDocuments(),
    Transaction.countDocuments(),
    Address.countDocuments(),
  ]);

  assert.equal(firstResult.order.orderNumber, 5001);
  assert.equal(secondResult.alreadyCompleted, true);
  assert.equal(secondResult.order._id.toString(), firstResult.order._id.toString());
  assert.equal(refreshedAttempt.status, "completed");
  assert.equal(refreshedAttempt.finalizationAttempts, 1);
  assert.equal(refreshedProduct.stock, 8);
  assert.equal(orderCount, 1);
  assert.equal(transactionCount, 1);
  assert.equal(addressCount, 1);
});

test("a failure while creating the order rolls back every preceding write", async () => {
  const { attempt, product } = await createCheckout("1002");
  await PaymentAttempt.collection.updateOne(
    { _id: attempt._id },
    { $unset: { "customer.phoneNumber": "" } }
  );

  await assert.rejects(
    finalizePaymentAttempt({
      attemptId: attempt._id,
      razorpayOrderId: attempt.razorpayOrderId,
      razorpayPaymentId: "pay_test_rollback",
      razorpaySignature: "test-signature",
      source: "frontend",
    }),
    /Phone is required/
  );

  const [
    refreshedAttempt,
    refreshedProduct,
    orderCount,
    transactionCount,
    addressCount,
  ] = await Promise.all([
    PaymentAttempt.findById(attempt._id),
    Product.findById(product._id),
    Order.countDocuments(),
    Transaction.countDocuments(),
    Address.countDocuments(),
  ]);

  assert.equal(refreshedAttempt.status, "failed");
  assert.equal(refreshedAttempt.lastErrorStage, "creating order");
  assert.equal(refreshedProduct.stock, 10);
  assert.equal(orderCount, 0);
  assert.equal(transactionCount, 0);
  assert.equal(addressCount, 0);
});

test("recovery relinks a legacy order without reserving its stock again", async () => {
  const { attempt, product } = await createCheckout("1003");
  const address = await Address.create({
    street: "1 Test Street",
    city: "New Delhi",
    state: "Delhi",
    country: "India",
    pincode: "110001",
    userId: attempt.userId,
  });
  const transaction = await Transaction.create({
    userId: attempt.userId,
    amount: attempt.amount,
    paymentMode: "UPI",
    status: "SUCCESS",
    providerPaymentId: "pay_test_legacy",
    providerOrderId: attempt.razorpayOrderId,
  });
  const order = await Order.create({
    paymentAttemptId: attempt._id,
    userId: attempt.userId,
    products: attempt.products,
    total: attempt.amount,
    address: address._id,
    phone: attempt.customer.phoneNumber,
    transactionId: transaction._id,
    orderNumber: 5100,
  });

  await Product.findByIdAndUpdate(product._id, { $inc: { stock: -2 } });
  const result = await finalizePaymentAttempt({
    attemptId: attempt._id,
    razorpayOrderId: attempt.razorpayOrderId,
    razorpayPaymentId: "pay_test_legacy",
    source: "reconciliation",
  });

  const [refreshedAttempt, refreshedProduct] = await Promise.all([
    PaymentAttempt.findById(attempt._id),
    Product.findById(product._id),
  ]);

  assert.equal(result.alreadyCompleted, true);
  assert.equal(result.order._id.toString(), order._id.toString());
  assert.equal(refreshedAttempt.orderId.toString(), order._id.toString());
  assert.equal(refreshedAttempt.status, "completed");
  assert.equal(refreshedProduct.stock, 8);
  assert.equal(await Order.countDocuments(), 1);
});
