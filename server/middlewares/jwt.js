import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const createToken = (req,res,next) => {
    const user = req.res.locals.user
    const token = jwt.sign(JSON.stringify(user),process.env.SECRET)
    return res.status(200).json({
        message:"Authentication Successful",
        token,user 
    })
}

export const validateToken = (req,res,next) => {
    const token = req.get("Authorization")
    const user_id = req.get("User_id")
    const json = jwt.verify(token,process.env.SECRET)
    if(json._id == user_id){
        return res.status(200).json({
            message:"Validation Successful",
            user: json
        })
    }
    return res.status(401).json({
        message: "Unauthorized",    
    })
}