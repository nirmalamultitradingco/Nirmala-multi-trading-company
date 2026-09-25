import mongoose from 'mongoose';

// Cache connection across serverless function invocations
let cached = global._mongoose;

if (!cached) {
  cached = global._mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    const errorMsg = 'MONGO_URI is not set. Please add MONGO_URI in your Vercel Environment Variables or .env file.';
    console.error(errorMsg);
    throw new Error(errorMsg);
  }

  // Reuse existing connection if ready
  if (cached.conn && mongoose.connection.readyState >= 1) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      serverSelectionTimeoutMS: 5000,
    };

    cached.promise = mongoose
      .connect(uri, opts)
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.host}/${m.connection.name}`);
        return m;
      })
      .catch((err) => {
        cached.promise = null;
        console.error('MongoDB connection failed:', err.message);
        throw err;
      });
  }

  try {
    cached.conn = await cached.promise;
    return cached.conn;
  } catch (err) {
    cached.promise = null;
    throw err;
  }
};

