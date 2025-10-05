import { connect } from "mongoose";

const connectDB = async (dbUrl) => {
  try {
    await connect(dbUrl);
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1); // Exit process with failure
  }
};

export default connectDB;