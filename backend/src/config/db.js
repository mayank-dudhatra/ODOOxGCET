import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || "mongodb://localhost:27017/dayflow";
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`⚠️  MongoDB Connection Error: ${error.message}`);
    console.warn("💡 Tip: Make sure MongoDB is running or update MONGO_URI in .env");
    console.log("📌 App will still run - API endpoints are available");
    // Don't exit - app can still run without DB for now
  }
};

export default connectDB;
