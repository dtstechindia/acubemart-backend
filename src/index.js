import 'dotenv/config'
import express from "express"
import cors from 'cors';
import ConnectDB from './db/connection.db.js';

import { errorHandler } from './middlewares/errorhandler.middleware.js';

import userRouter from './routes/user.route.js';
import bodyParser from 'body-parser';

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

  //Routes
app.get("/", (_req, res) => {
    res.send("Server is Running...")
  });

app.get('/api/health', (_req, res) => {
    res.send("Server is Healthy ...")
})
  
  app.listen(port, () => {
    console.log(`Server is Running at PORT: ${port}`);
  });