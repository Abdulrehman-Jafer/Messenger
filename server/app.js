import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv";
import authRoutes from "./routes/user.js"
import cors from "cors"
import session from "express-session"
import session_store from "./configs/session-store.js"
import contactRoutes from "./routes/contact.js";
import chatSpaceRoutes from "./routes/chatspace.js"
import messageRoutes from "./routes/message.js"
import http from "http"
import socketIo_config from "./configs/socket.io_config.js";

const app = express()
dotenv.config();
app.use(cors());
app.use(express.json())
app.use(session({ secret: process.env.SECRET, resave:false, saveUninitialized: false, store: session_store, name:"express-session",}))
app.use("/storage",express.static("./storage"))

app.use("/auth",authRoutes)
app.use("/contact",contactRoutes)
app.use("/chatspace",chatSpaceRoutes)
app.use("/message", messageRoutes)



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
const server = http.createServer(app)

const io  = socketIo_config.init(server)

mongoose.connect(process.env.MONGO_URI).then(()=>{
    server.listen(process.env.PORT,()=>console.log("Listening!"))
}).catch((error)=>{
    throw new Error(error)
})
export const getIo = () => {
    return io;
}
export default app


