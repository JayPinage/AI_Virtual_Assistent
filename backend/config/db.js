import mongoose from "mongoose"


const connectDb = async () => {
    try {
        if (!process.env.MONGODB_URL) {
            throw new Error("MONGODB_URL is not set")
        }

        await mongoose.connect(process.env.MONGODB_URL)
        console.log("db connected")
    } catch (error) {
        console.error("MongoDB connection failed:", error.message)
        throw error
    }
}


export default connectDb

