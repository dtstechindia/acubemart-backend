import mongoose from 'mongoose';
import Order from "../models/order.model.js";
/* import Product from "../models/product.model.js";
import fs from 'fs';
import { json2csv } from 'json-2-csv';
 */
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

/* const getProductsDataAndWriteToFile = async () => {
  try {
    const products = await Product.find({ status: "published" })
    .populate({ path: "type", select: "name _id" })
    .populate({ path: "category", select: "name description isActive _id" })
    .populate({ path: "element", select: "name description _id" })
    .populate({ path: "brand", select: "name logo description _id" })
    .populate({ path: "model", select: "name description _id" })
    .populate({
      path: "image",
      select: "url isFeatured _id",
      strictPopulate: false,
    })
    .populate({
      path: "attributes",
      select: "name value _id",
      strictPopulate: false,
    })
    .populate({
      path: "variants",
      select: "name mrp sp discount deliveryCharges codCharges video variantAttributes description sku barcode stock _id",
      strictPopulate: false,
      populate: {
        path: "image",
        select: "url _id",
        strictPopulate: false,
      },
    })
    .populate({
      path: "featuredImage",
      select: "url _id",
      strictPopulate: false,
    });
    if(products) console.log("Products Data Fetched Successfully");
    
    //create a data form products with fields _id, name, description, price, sp, image: featuredImage
    const data = products.map((product, index) => ({
      //_id: product._id,
      id: index + 1,
      title: product.name,
      description: product.description,
      link: `https://www.acubemart.in/product/${product.slug}`,
      image_link: product.featuredImage?.url,
      price: `${product.price.toFixed(2)} INR`,
      sale_price: `${product.sp.toFixed(2)} INR`,
      availability: product.stock > 0 ? "in_stock" : "out_of_stock",
      stock: product.stock,
      barcode: product.barcode,
      whole_sale_price: "",
      stock_jump: "",
    }))

    //extract variants data from all the products and add to the data array with same format and continuation of the data array
    for (let i = 0; i < products.length; i++) {
      for (let j = 0; j < products[i].variants.length; j++) {
        data.push({
          id: i + 1,
          title: products[i].variants[j].name,
          description: products[i].variants[j].description,
          link: `https://www.acubemart.in/product/${products[i].slug}`,
          image_link: products[i].variants[j].image[0]?.url,
          price: `${products[i].variants[j].mrp.toFixed(2)} INR`,
          sale_price: `${products[i].variants[j].sp.toFixed(2)} INR`,
          availability: products[i].variants[j].stock > 0 ? "in_stock" : "out_of_stock",
          stock: products[i].variants[j].stock,
          barcode: products[i].variants[j].barcode,
          whole_sale_price: "",
          stock_jump: "",
        });
      }
    }
    //convert data so that to write it into a csv file 
    const csv = await json2csv(data);
    console.log("Data converted to CSV successfully");
    fs.writeFileSync("products.csv", csv);
    console.log("Data written to file successfully");
  } catch (error) {
    console.log(error);
  }
};
getProductsDataAndWriteToFile(); */

export { initializeCounter, getOrderNumber };