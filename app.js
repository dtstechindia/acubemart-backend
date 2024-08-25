import 'dotenv/config'
import express from "express"
import cors from 'cors';
import multer from 'multer';

import ConnectDB from './src/db/connection.db.js';
import { errorHandler } from './src/middlewares/errorhandler.middleware.js';

import userRouter from './src/routes/user.route.js';
import productRouter from './src/routes/product.route.js';
import cartRouter from './src/routes/cart.route.js';
import categoryRouter from './src/routes/category.route.js';
import brandRouter from './src/routes/brand.route.js';
import modelRouter from './src/routes/model.route.js';
import imageRouter from './src/routes/image.route.js';
import addressRouter from './src/routes/address.route.js';
import orderRouter from './src/routes/order.route.js';
import transactionRouter from './src/routes/transaction.route.js';
import typeRouter from './src/routes/type.route.js';
import attributeRouter from './src/routes/attribute.route.js';
import elementRouter from './src/routes/element.route.js';
import variantRouter from './src/routes/variant.route.js';
import adminRouter from './src/routes/admin.route.js';
import mediaRouter from './src/routes/media.route.js';
import couponRouter from './src/routes/coupon.route.js';


//App
const app = express();
const port = process.env.PORT;


//Database connection
ConnectDB();


//Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('uploads'));

app.use(errorHandler);


app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/category', categoryRouter);
app.use('/api/brand', brandRouter);
app.use('/api/model', modelRouter);
app.use('/api/image', imageRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);
app.use('/api/transaction', transactionRouter);
app.use('/api/type', typeRouter);
app.use('/api/attribute', attributeRouter);
app.use('/api/element', elementRouter);
app.use('/api/variant', variantRouter);
app.use('/api/admin', adminRouter);
app.use('/api/media', mediaRouter);
app.use('/api/coupon', couponRouter);


// Home Route
app.get("/", (_req, res) => {
    res.send("Server is Running...")
  });


// Health Route
app.get('/api/health', (_req, res) => {
    res.send("Server is Healthy ...")
});


//Port Listening
  app.listen(port, () => {
    console.log(`Server is Running at PORT: ${port}`);
  });