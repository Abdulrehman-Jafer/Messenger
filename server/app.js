import express from "express"
import mongoose from "mongoose"
import dotenv from "dotenv";
import authRoutes from "./routes/user.js"
import multer from "multer";
import cors from "cors"
import session from "express-session"
import session_store from "./configs/session-store.js"
import {fileFilter,storage} from "./configs/multer_config.js"
import contactRoutes from "./routes/contact.js";
import chatSpaceRoutes from "./routes/chatspace.js"
import messageRoutes from "./routes/message.js"
import http from "http"
import {Server} from "socket.io"
import axios from "axios";


const app = express()
dotenv.config();
app.use(cors());
app.use(multer({storage,fileFilter}).single("image"))
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
const io  = new Server(server,{
    cors: {
        origin:"*",
        methods:"*"
    }
})

io.on("connection",(socket)=>{
    console.log(`${socket.id} connected`)
    socket.on("disconnect",()=>{
        console.log(`${socket.id} disconnected`)
    })
    
    socket.on("send-message",(data)=>{
        console.log(data);
        axios.post("http://localhost:3000/message/send",data).then(res => console.log(res)).catch(err => {
            console.log(err)
        })
        // Do something with the received data, e.g., broadcasting it to all connected clients:
        // Add message into the chatspace
        io.emit("receive-message", data);
        // socket.broadcast(data)
    })
})


mongoose.connect(process.env.MONGO_URI).then(()=>{
    server.listen(process.env.PORT,()=>console.log("Listening!"))
}).catch((error)=>{
    throw new Error(error)
})

export default app