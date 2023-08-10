import User from "../models/user.js"
import bcrypt from "bcrypt"

export const createUser = async (req,res,next) => {
    const {name,password,email,provider} = req.body
    try {
        const existingUser = await User.findOne({email,provider})
        if(existingUser){
            return res.status(408).json({
                message: "Conflict, Email already exist!"
            })
        }
        const imageFile = req.file
        const hashedPSWD = await bcrypt.hash(password,12)
        const count = await User.countDocuments()
        const public_number = String(count + 1).padStart(6,'0')
        const user = new User({
            provider,
            name,
            email,
            password:hashedPSWD,
            image: `storage/profile_pictures/${imageFile.filename}`,
            public_number
        })
        await user.save()
        return res.status(201).json({
            message:"User creation successful!",
            user_data: user
        })
    } catch (error) {
        return next (error)
    }
}

export const authenticateUser = async (req,res,next) => {
    const {email,provider} = req.body
    try {
        const user = await User.findOne({email,provider})
        if(!user){
            return res.status(404).json({
                message: "Email does not exist!"
            })
        }
           const isMatched = await bcrypt.compare(req.body.password,user.password)
           if(!isMatched){
            return res.status(401).json({
                message: "Incorrect Password"
            })
           }
           res.locals.user = user;
           return next()
    } catch (error) {
        return next(error)
    }
}

export const continueWithGoogle = async (req,res,next) => {
            const { name,google_uid,image,email,provider } = req.body
            try {
                const existingUser = await User.findOne({email,provider})
                if(existingUser){
                    const isMatched = await bcrypt.compare(google_uid,existingUser.google_uid)
                    if(!isMatched){
                        return res.status(401).json({
                            message: "Incorrect google uid"
                        })
                       }
                       res.locals.user = existingUser;
                       return next()
                }
                const hashedUID = await bcrypt.hash(google_uid,12)
                const count = await User.countDocuments()
                const public_number = String(count + 1).padStart(6,'0')
                const user = new User({provider,name,email,google_uid: hashedUID,image,public_number})
                await user.save()
                res.locals.user = user
                return next()
            } catch (error) {
               return next(error)
            }
        }

