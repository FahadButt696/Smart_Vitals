import { connect } from "mongoose";
import { config } from 'dotenv';
config();

const connectDB = async () => {

   connect(process.env.CONN_STRING, {
    dbName: process.env.DB_NAME,
    pass:process.env.PASSWORD,
    user:process.env.USER_NAME
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));
};
export default connectDB;
