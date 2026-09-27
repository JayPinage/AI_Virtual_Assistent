
import express from "express"
import dotenv from "dotenv"
import dns from "node:dns"
import connectDb from "./config/db.js"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.routes.js"
import cors from "cors"
import userRouter from "./routes/user.routes.js"
import { startLlamaServer } from "./startllm.js";


dotenv.config()

dns.setServers(["1.1.1.1", "1.0.0.1"])

const app = express()
app.use(cors({
        origin:"http://localhost:5173",
        credentials:true
}))
const port = process.env.PORT || 5000

app.use(express.json())
app.use(cookieParser())
app.use("/api/auth",authRouter)
app.use("/api/user",userRouter)



await startLlamaServer();
app.listen(port, () => {
        connectDb()
         console.log(`server started on port ${port}`)
        })


