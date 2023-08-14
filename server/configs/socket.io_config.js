import {Server} from "socket.io"
import User from "../models/user.js";
import Message from "../models/message.js";
import {Readable} from "stream"
import { createWriteStream, mkdirSync } from "fs";
import { existsSync } from "fs";
import Ffmpeg from "fluent-ffmpeg";

let io;


export default {
    init: (httpServer) => {
        io = new Server(httpServer,{
            cors: {
                origin:"*",
                methods:"*"
        },
            maxHttpBufferSize:1e8
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
                    contentType: "text",
                    sender: data.sender._id,
                    receiver: data.receiver,
                    createdAt:data.createdAt,
                    status: 1,
                    deletedFor: [],
                    deletedForEveryone:false
                })
                try {
                    // await message.save()
                } catch (error) {
                    throw(new Error(error))
                }
                const modifiedMessage = {...message._doc,sender: data.sender}
                socket.emit("message-saved",{chatspace_id:message.belongsTo,tempId: data._id, modifiedMessage})
                if(data.receiver.socketId){
                    console.log({receiverSocketId: data.receiver.socketId})
                    socket.to(data.receiver.socketId).emit("receive-message",{message:modifiedMessage,sender:data.sender,})
                }
            })
        
            socket.on("deleteMessageForEveryone", (data) => {
                socket.to(data.receiverSocketId).emit("messageDeletedForEveryone",{chatspace_id: data.chatspace_id,message_id:data.message_id})
            })
            
            socket.on("sendFile",async (data) => {
                const uniqueSuffix = Date.now() + "_" + Math.round(Math.random() * 1E9)
                const uniqueName = (uniqueSuffix + "__" + data.filename).replace(/\s+/g, "")
                const inStream = new Readable({
                    read(size) {
                        this.push(data.file)
                        this.push(null)
                    }
                })
                console.log({file:data.file})
                const dir = `./storage/chat_files/${data.chatspace_id}`
                if(!existsSync(dir)){
                    mkdirSync(dir,{recursive:true})}
                const outStream = createWriteStream(`./storage/chat_files/${data.chatspace_id}/${uniqueName}`)
                inStream.pipe(outStream).on("error",(error)=>{
                    console.log("Error",error)
                })
        
                inStream.on("end", async () => {
                    console.log("Finished Streaming");
                    const tempId = data.newMessage._id;
                    delete data.newMessage._id;
                    const message = new Message({
                      ...data.newMessage,
                      content: `/storage/chat_files/${data.chatspace_id}/${uniqueName}`,
                      status: 0,
                    });
                    // We can also save the meta data of file on the database like name
                    try {
                        // await message.save()
                        const modifiedMessage = {...message._doc,sender: data.newMessage.sender,receiver:data.newMessage.receiver}
                        socket.emit("message-saved",{chatspace_id:message.belongsTo,tempId, modifiedMessage})
                        if(data.newMessage.receiver.socketId){
                            console.log({receiverSocketId: data.newMessage.receiver.socketId})
                            socket.to(data.newMessage.receiver.socketId).emit("receive-message",{message:modifiedMessage})
                        }
                    } catch (error) {
                        console.error("Error saving message:", error); 
                    }
                  });
            
            socket.on("disconnect",async ()=>{
                socket.broadcast.emit("user-offline",socket.id)
                await User.findOneAndUpdate({socketId: socket.id},{socketId: "",lastLogin: Date.now()},{new: true})
            })
        })
        })
        return io;
    },
    getIO: ()=>{
        if(!io){
            throw new Error("Socket IO is unitiailzed!!")
        }
        return io;
    }
}