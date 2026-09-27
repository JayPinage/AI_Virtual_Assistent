import express from "express"
import isAuth from "../middleware/isAuth.js"
import { askToAssistant, getCurrentUser, updateAssistent } from "../controllers/userController.js"
import upload from "../middleware/multer.js"

const userRouter = express.Router()


userRouter.get("/current",isAuth,getCurrentUser)
userRouter.post("/update",isAuth,upload.single("assistantImage"),updateAssistent)
userRouter.post("/asktoassistant",isAuth,askToAssistant)
export default userRouter