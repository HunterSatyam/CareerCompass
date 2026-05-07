import mongoose from "mongoose";

const connectDB = async () => {
    if (!process.env.MONGO_URI) {
        throw new Error("MONGO_URI is not configured");
    }

    try {
        console.log('Attempting to connect to MongoDB...');
        const uri = process.env.MONGO_URI.trim();
        await mongoose.connect(uri, {
            serverSelectionTimeoutMS: 10000,
        });
        console.log('mongodb connected successfully');
    } catch (error) {
        console.error('MongoDB connection failed:', error.message);
        throw error;
    }
}
export default connectDB;
