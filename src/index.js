import 'dotenv/config'
import express from "express"
import cors from 'cors';
import multer from 'multer';

import ConnectDB from './db/connection.db.js';
import { errorHandler } from './middlewares/errorhandler.middleware.js';

import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';
import categoryRouter from './routes/category.route.js';
import brandRouter from './routes/brand.route.js';
import modelRouter from './routes/model.route.js';
import imageRouter from './routes/image.route.js';
import addressRouter from './routes/address.route.js';
import orderRouter from './routes/order.route.js';
import transactionRouter from './routes/transaction.route.js';
import typeRouter from './routes/type.route.js';
import attributeRouter from './routes/attribute.route.js';
import elementRouter from './routes/element.route.js';
import variantRouter from './routes/variant.route.js';
import adminRouter from './routes/admin.route.js';
import mediaRouter from './routes/media.route.js';


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