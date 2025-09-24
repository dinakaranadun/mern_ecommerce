import mongoose from "mongoose";

const connectDB = async()=>{
    try {

        const conn = await mongoose.connect(process.env.MONGOOSE_URI);

        console.log(`Mongo Db connected: ${conn.connection.host}`);    
    } catch (e) {

        console.error(`Error ${e.message}`);
        process.exit(1);
    }
}

export default connectDB;