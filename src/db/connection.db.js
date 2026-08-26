import "dotenv/config";
import mongoose from "mongoose";

// Database connection
async function ConnectDB() {
  if (mongoose.connection.readyState === 1) {
    console.log("MongoDB is already connected.");
    return;
  }

  try {
    await mongoose.connect(
      `${process.env.MONGODB_URI}/${process.env.DB_NAME}`,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error}`);
    throw error;
  }
}

export default ConnectDB;
