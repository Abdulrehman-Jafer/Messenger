import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv";
import authRoutes from "./routes/user.js"
import multer from "multer";
import cors from "cors"
import session from "express-session"
import session_store from "./configs/session-store.js"
import {fileFilter,storage} from "./configs/multer_config.js"


const app = express()
dotenv.config();
app.use(cors());
app.use(multer({storage,fileFilter}).single("image"))
app.use(express.json())
app.use(session({ secret: process.env.SECRET, resave:false, saveUninitialized: false, store: session_store, name:"express-session",}))
app.use("/storage",express.static("./storage"))

app.use("/auth",authRoutes)



// For unexisting routes
app.use("*",(req,res,next)=>{
    return res.status(404).json({message:"EndPoint does not exists"})
})

// For Error Handling
app.use((error,req,res,next)=>{
    if(!error.statusCode){
        error.statusCode = 500
    }
     console.log(error)
    return res.status(error.statusCode).json(error)
})

mongoose.connect(process.env.MONGO_URI).then(()=>{
    app.listen(process.env.PORT,()=>console.log("Listening!"))
}).catch((error)=>{
    throw new Error(error)
})

export default app