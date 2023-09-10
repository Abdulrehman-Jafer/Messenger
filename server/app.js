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
import User from "./models/user.js";
import Message from "./models/message.js";
import { handleError } from "./middlewares/error.js";
import { handle404 } from "./middlewares/404.js";

const app = express()
dotenv.config();
app.use(cors());
app.use(express.json())
app.use(session({ secret: process.env.SECRET, resave:false, saveUninitialized: false, store: session_store, name:"express-session",}))
app.use("/storage",express.static("./storage"))

app.use("/user",authRoutes)
app.use("/contact",contactRoutes)
app.use("/chatspace",chatSpaceRoutes)
app.use("/message", messageRoutes)
app.use("*",handle404)
app.use(handleError)




const server = http.createServer(app)
const io  = socketIo_config.init(server)
mongoose.connect(process.env.MONGO_URI).then(()=>{
    // User.collection.getIndexes({full: true}).then(indexes => {
    //     console.log("indexes of User", indexes);
    //     // ...
    // }).catch(console.error);
    // Message.collection.getIndexes({full:true}).then(indexes => {
    //     console.log("indexes of Message",indexes)
    // }).catch(console.error)
    server.listen(process.env.PORT,()=>console.log("Listening!"))
}).catch((error)=>{
    throw new Error(error)
})

export default app


