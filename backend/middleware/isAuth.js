import jwt from "jsonwebtoken"
const isAuth = async (req, res, next) => {

    try {

        const token = req.cookies.token

        if (!token) {
            return res.status(400).json({ message: "token not found" })
        }

        const tokenVerify = await jwt.verify(token, process.env.JWT_SECRET)

        req.userId = tokenVerify.userId;

        next()


    } catch (error) {
        console.log(error)
        res.status(500).json({ message: "error in tokens" })
    }

}


export default isAuth