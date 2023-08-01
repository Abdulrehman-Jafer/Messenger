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
import User from "./models/user.js";
import { Types } from "mongoose";
import Message from "./models/message.js";
import Chatspace from "./models/chatspace.js";

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
    socket.on("disconnect",async ()=>{
        const user = await User.findOneAndUpdate({socketId: socket.id},{socketId: ""},{new: true})
        console.log(`${user?.name || socket.id} disconnected`)
    })

    socket.on("set-socketId",async (user_data)=>{
       const user = await User.findOneAndUpdate({_id: user_data._id},{socketId: socket.id,lastLogin: 0 },{new: true})
       // BroadCast this User Got Online and Sender this user_data with the
       socket.broadcast.emit("user-online",user)
    })
    socket.on("send-message",async (data)=>{
        const message = new Message({
            belongsTo: data.belongsTo,
            content: data.content,
            sender: data.sender._id,
            receiver: data.receiver,
            status: 0,
            deletedFor: []
        })
        const savetheMessage = message.save()
        const updatetheChatspace = Chatspace.findOneAndUpdate(
            {_id: message.belongsTo},
            {$push: {messages: message}},
            {new: true})
        console.log({socketIdOfSender: data.sender.socketId,receiver: data.receiver.socketId})
        if(data.receiver.socketId){
            socket.to(data.receiver.socketId).emit("receive-message",{message,sender:data.sender})
        }
        socket.to(data.sender.socketId).emit("message-saved",{prevId: data._id, message})
        // Do something with the received data, e.g., broadcasting it to all connected clients:
        // Add message into the chatspace
        // socket.broadcast(data)
        await savetheMessage
        await updatetheChatspace
    })
})


mongoose.connect(process.env.MONGO_URI).then(()=>{
    server.listen(process.env.PORT,()=>console.log("Listening!"))
}).catch((error)=>{
    throw new Error(error)
})

export default app