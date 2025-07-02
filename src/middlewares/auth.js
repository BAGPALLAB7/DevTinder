import jwt from "jsonwebtoken";
import User from "../models/user.js";

 const userAuth = async (req, res, next) => {
    try {
        const {token} = req.cookies;
        if (!token) {
            throw new Error("Unauthorized access");
        }
        const cookieData = jwt.verify(token, "bagpallab7");
        const user  = await User.findById(cookieData._id);
        req.user = user;
        next();
        
    } catch (error) {
        res.status(401).send("Unauthorized access - " + error.message);
    }
}

export default userAuth;