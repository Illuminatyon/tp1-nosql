import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const mongoURI = process.env.MONGO_URI;

async function connectDB() {
	try {
		await mongoose.connect(mongoURI);
		console.log('MongoDB connected');
	} catch (error) {
		console.error('MongoDB connection failed');
		console.error(error);
	}
}

export default connectDB;
