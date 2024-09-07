import "dotenv/config";
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
import express from "express";
import cors from "cors";
import Razorpay from "razorpay";
import multer from "multer";

import ConnectDB from "./src/db/connection.db.js";
import { errorHandler } from "./src/middlewares/errorhandler.middleware.js";

import userRouter from "./src/routes/user.route.js";
import productRouter from "./src/routes/product.route.js";
import cartRouter from "./src/routes/cart.route.js";
import categoryRouter from "./src/routes/category.route.js";
import brandRouter from "./src/routes/brand.route.js";
import modelRouter from "./src/routes/model.route.js";
import imageRouter from "./src/routes/image.route.js";
import addressRouter from "./src/routes/address.route.js";
import orderRouter from "./src/routes/order.route.js";
import transactionRouter from "./src/routes/transaction.route.js";
import typeRouter from "./src/routes/type.route.js";
import attributeRouter from "./src/routes/attribute.route.js";
import elementRouter from "./src/routes/element.route.js";
import variantRouter from "./src/routes/variant.route.js";
import adminRouter from "./src/routes/admin.route.js";
import mediaRouter from "./src/routes/media.route.js";
import couponRouter from "./src/routes/coupon.route.js";
import paymentMethodRouter from "./src/routes/paymentmethod.route.js";
import paymentRouter from "./src/routes/payment.route.js";

//App
const app = express();
const port = process.env.PORT || 3000;

//Database connection
ConnectDB();

//Middlewares
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "50mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "50mb", parameterLimit: 1000000 })
);
app.use(express.static("uploads"));

app.use(errorHandler);

app.use("/api/user", userRouter);
app.use("/api/product", productRouter);
app.use("/api/cart", cartRouter);
app.use("/api/category", categoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/model", modelRouter);
app.use("/api/image", imageRouter);
app.use("/api/address", addressRouter);
app.use("/api/order", orderRouter);
app.use("/api/transaction", transactionRouter);
app.use("/api/type", typeRouter);
app.use("/api/attribute", attributeRouter);
app.use("/api/element", elementRouter);
app.use("/api/variant", variantRouter);
app.use("/api/admin", adminRouter);
app.use("/api/media", mediaRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/paymentmethod", paymentMethodRouter);
app.use("/api/payment/order", paymentRouter);

// Home Route
app.get("/", (_req, res) => {
  res.send("Server is Running...");
});

// Health Route
app.get("/api/health", (_req, res) => {
  res.send("Server is Healthy ...");
});

// ZERO SSL Validation
app.get(
  "/.well-known/pki-validation/14279CB10049F94424683C2B23044845.txt",
  (_req, res) => {
    res.send(
      "754F182D38B19168907B8534D046D336ECAD0A218755A0084209740046DBBBC7\ncomodoca.com\n71770c20c84f5b5"
    );
  }
);

//Port Listening
app.listen(port, () => {
  console.log(`Server is Running at PORT: ${port}`);
});
