import 'dotenv/config';
import mongoose from 'mongoose';

async function ConnectDB() {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
        console.log("MongoDB Connected Successfully");
    } catch (error) {
        console.log(`MongoDB Connection Error: ${error}`);
    }
}

export default ConnectDB;