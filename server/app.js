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
import User from "./models/user.js";
import Message from "./models/message.js";

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
    socket.on("set-socketId",async (user_data)=>{
        if(!user_data._id) return null;
        const user = await User.findOneAndUpdate({_id: user_data._id},{socketId: socket.id,lastLogin: 0 },{new: true})
        socket.broadcast.emit("user-online",user)
    })

    socket.on("send-message",async (data)=>{
        const message = new Message({
            belongsTo: data.belongsTo,
            content: data.content,
            sender: data.sender._id,
            receiver: data.receiver,
            createdAt:data.createdAt,
            status: 1,
            deletedFor: [],
            deletedForEveryone:false
        })
        
        await message.save()
        socket.emit("message-saved",{chatspace_id:message.belongsTo,tempId: data._id, mongo_message_id: message._id})
        const modifiedMessage = {...message._doc,sender: data.sender}
        if(data.receiver.socketId){
            console.log({receiverSocketId: data.receiver.socketId})
            socket.to(data.receiver.socketId).emit("receive-message",{message:modifiedMessage,sender:data.sender,})
        }
    })

    socket.on("deleteMessageForEveryone", (data) => {
        socket.to(data.receiverSocketId).emit("messageDeletedForEveryone",{chatspace_id: data.chatspace_id,message_id:data.message_id})
    })
    
    socket.on("disconnect",async ()=>{
        socket.broadcast.emit("user-offline",socket.id)
        await User.findOneAndUpdate({socketId: socket.id},{socketId: "",lastLogin: Date.now()},{new: true})
    })
})


mongoose.connect(process.env.MONGO_URI).then(()=>{
    server.listen(process.env.PORT,()=>console.log("Listening!"))
}).catch((error)=>{
    throw new Error(error)
})

export default app