import mongoose from "mongoose";
import { Schema } from "mongoose";

const paymentAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User Id is required"],
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: [true, "Product Id is required"],
        },
        quantity: {
          type: Number,
          required: [true, "Quantity is required"],
        },
        variantId: {
          type: Schema.Types.ObjectId,
          ref: "Variant",
        },
        name: {
          type: String,
        },
        price: {
          type: Number,
        },
      },
    ],
    shippingAddress: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      pincode: String,
      district: String,
    },
    billingAddress: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        default: "India",
      },
      pincode: String,
      district: String,
    },
    customer: {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: {
        type: String,
        required: [true, "Phone number is required"],
      },
    },
    amount: {
      type: Number,
      required: [true, "Amount is required"],
    },
    subtotal: {
      type: Number,
      default: 0,
    },
    codCharges: {
      type: Number,
      default: 0,
    },
    totalDiscount: {
      type: Number,
      default: 0,
    },
    pendingAmount: {
      type: Number,
      default: 0,
    },
    currency: {
      type: String,
      default: "INR",
    },
    couponId: {
      type: Schema.Types.ObjectId,
      ref: "Coupon",
    },
    paymentOption: {
      type: String,
      enum: ["prepaid", "advance"],
      required: [true, "Payment option is required"],
    },
    deliveryOption: {
      type: String,
      required: [true, "Delivery option is required"],
    },
    status: {
      type: String,
      enum: ["created", "processing", "paid", "completed", "failed"],
      default: "created",
    },
    razorpayOrderId: {
      type: String,
      index: true,
      sparse: true,
    },
    razorpayPaymentId: {
      type: String,
      index: true,
      sparse: true,
    },
    razorpaySignature: {
      type: String,
    },
    receipt: {
      type: String,
      index: true,
      sparse: true,
    },
    addressId: {
      type: Schema.Types.ObjectId,
      ref: "Address",
    },
    transactionId: {
      type: Schema.Types.ObjectId,
      ref: "Transaction",
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
    },
    orderNumber: {
      type: Number,
    },
    paidAt: {
      type: Date,
    },
    completedAt: {
      type: Date,
    },
    processingStartedAt: {
      type: Date,
    },
    finalizationAttempts: {
      type: Number,
      default: 0,
    },
    lastFinalizationAt: {
      type: Date,
    },
    lastError: {
      type: String,
    },
    lastErrorStage: {
      type: String,
    },
    providerError: {
      code: String,
      description: String,
      source: String,
      step: String,
      reason: String,
    },
    lastEventSource: {
      type: String,
      enum: ["frontend", "webhook", "reconciliation"],
    },
  },
  {
    timestamps: true,
  }
);

const paymentAttemptModel = mongoose.model(
  "PaymentAttempt",
  paymentAttemptSchema
);

export default paymentAttemptModel;
