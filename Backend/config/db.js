import { connect } from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    await connect(process.env.CONN_STRING, {
      dbName: process.env.DB_NAME,
      pass:process.env.PASSWORD,
      user:process.env.USER_NAME
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;

