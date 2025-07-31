import { connect } from "mongoose";
import { config } from "dotenv";
config();

const connectDB = async () => {
  try {
    await connect(process.env.CONN_STRING, {
      dbName: process.env.DB_NAME,
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

export default connectDB;

