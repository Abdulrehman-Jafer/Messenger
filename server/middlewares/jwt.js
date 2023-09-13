import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import User from "../models/user.js"
import { returnResponse } from "../utils/response.js"

dotenv.config()

export const createToken = (req,res,next) => {
    const user = req.res.locals.user
    const token = jwt.sign(JSON.stringify(user),process.env.SECRET)
    return res.status(200).json({
        message:"Authentication Successful",
        token,user 
    })
}

export const validateToken = async (req,res,next) => {
    const token = req.get("authorization")
    const user_id = req.query.user_id
    const json = jwt.verify(token,process.env.SECRET)
    if(json._id == user_id){
        const user = await User.findOne({_id:user_id})
        return returnResponse(res,200,"Validation successful",user,true)
    }
    return returnResponse(res,403,"Validation failed",{token,user_id},false)
}