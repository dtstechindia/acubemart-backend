import mongoose from 'mongoose';
import Order from "../models/order.model.js";

// Create a new schema for the counter
const counterSchema = new mongoose.Schema({
  name: String,
  count: Number
});

// Create a model for the counter
const Counter = mongoose.model('Counter', counterSchema);

// Initialize the counter with a starting value
const initializeCounter = async () => {
  const counter = await Counter.findOne({ name: 'orderNumber' });
  if (!counter) {
    await Counter.create({ name: 'orderNumber', count: 5000 });
  }
};
//initializeCounter();

//insert Order Number to all existing orders
const updateOrderNumber = async () => {
  const orders = await Order.find();
  for (let i = 0; i < orders.length; i++) {
    orders[i].orderNumber = await getOrderNumber();
    await orders[i].save();
    console.log(orders[i]);
  }
};

//updateOrderNumber();

// Increment the counter and get the new order number
const getOrderNumber = async () => {
  const counter = await Counter.findOneAndUpdate({ name: 'orderNumber' }, { $inc: { count: 1 } }, { new: true });
  return counter.count;
};

export { initializeCounter, getOrderNumber };