import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: join(__dirname, '../../backend/.env') });
dotenv.config();

const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error('MONGO_URI is not defined in backend/.env');
    }
    const conn = await mongoose.connect(mongoUri, {
      dbName: 'blogvite',
    });
    console.log(`✅  MongoDB connected: ${conn.connection.host}`);
  } catch (err) {
    console.error('❌  MongoDB connection failed:', err.message);
    process.exit(1);
  }
};

export default connectDB;
