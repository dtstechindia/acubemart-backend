import 'dotenv/config'
import express from "express"
import cors from 'cors';
import bodyParser from 'body-parser';

import { errorHandler } from './middlewares/errorhandler.middleware.js';
import ConnectDB from './db/connection.db.js';

import userRouter from './routes/user.route.js';
import productRouter from './routes/product.route.js';
import cartRouter from './routes/cart.route.js';


//App
const app = express();
const port = process.env.PORT;


//Database connection
ConnectDB();


//Middlewares
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
  }))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
  
app.use(errorHandler);

app.use('/api/user', userRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);


// Home Route
app.get("/", (_req, res) => {
    res.send("Server is Running...")
  });


// Health Route
app.get('/api/health', (_req, res) => {
    res.send("Server is Healthy ...")
})


//Port Listening
  app.listen(port, () => {
    console.log(`Server is Running at PORT: ${port}`);
  });