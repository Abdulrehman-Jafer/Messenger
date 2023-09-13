import Message from "../models/message.js";
import Chatspace from "../models/chatspace.js";
// import {checkIsProvided,invalidDataResponse} from "../utils/checkIsProvided.js"

//(Validation)
import socketIo_config from "../configs/socket.io_config.js";
import { returnResponse } from "../utils/response.js";


export const sendMessage = async (req,res,next) => {
    const {data,messageFrom} = req.body;
    try {
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
       const savedMessage =  await message.save()
       const io = socketIo_config.getIO()
       const modifiedMessage = {...savedMessage._doc,sender: data.sender}
            if(data.receiver.socketId){
                io.to(data.receiver.socketId).emit("receive-message",{message:modifiedMessage,messageFrom})
            }
        return returnResponse(res,201,"Message sent successfully",{sentMessage:modifiedMessage},true)
    } catch (error) {
        next(error)
    }
}



export const sendAttachmentMessage = async (req,res,next) => {
        const data = req.body
        const attachment = req.file;
        console.log({data,attachment,body:req.body})
        delete data.newMessage._id;
        const message = new Message({
          ...data.newMessage,
          content: `/storage/chat_files/${data.chatspace_id}/${attachment.filename}`,
          status: 0,
        });
        // We can also save the meta data of file on the database like name
        try {
            // await message.save()
            const modifiedMessage = {...message._doc,sender: data.newMessage.sender,receiver:data.newMessage.receiver}
            if(data.newMessage.receiver.socketId){
                const io = socketIo_config.getIO()
                console.log({receiverSocketId: data.newMessage.receiver.socketId})
                io.to(data.newMessage.receiver.socketId).emit("receive-message",{message:modifiedMessage})
            }
            return res.status(201).json({
                responseCode: 201,
                responseText: "Attachment sent successfully",
                result : {
                    sentMessage : modifiedMessage
                }
            })
        } catch (error) {
            console.error("Error saving message:", error); 
            next(error)
        }
}

export const deleteForMe = async (req,res,next) => {
    const {message_id,user_id} = req.body;
    try {
        const deletedMessage = await Message.findOneAndUpdate({_id: message_id},{$push: {deletedFor: user_id} })
        return res.status(200).json({
            responseCode: 200,
            responseText: "Message deleted for you successfully",
            result: {
                deletedMessage
            }
        })
    } catch (error) {
        next(error)
    }
}

export const deleteForEveryone = async (req,res,next) => {
    const {message_id,chatspace_id,receiverSocketId} = req.body;
    try {
        const deletedForEveryone = await Message.findOneAndUpdate({_id: message_id},{content: "",deletedForEveryone:true},{new: true})
        const io = socketIo_config.getIO()
        io.to(receiverSocketId).emit("messageDeletedForEveryone",{chatspace_id,message_id})
        return res.status(200).json({
            responseCode: 200,
            responseText: "Message deleted successfully",
            result: {
                deletedForEveryone
            }
        })
    } catch (error) {
        next(error)
    }
}

// socket.emit('message', "this is a test"); //sending to sender-client only

// socket.broadcast.emit('message', "this is a test"); //sending to all clients except sender

// socket.broadcast.to('game').emit('message', 'nice game'); //sending to all clients in 'game' room(channel) except sender

// socket.to('game').emit('message', 'enjoy the game'); //sending to sender client, only if they are in 'game' room(channel)

// socket.broadcast.to(socketid).emit('message', 'for your eyes only'); //sending to individual socketid

// io.emit('message', "this is a test"); //sending to all clients, include sender

// io.in('game').emit('message', 'cool game'); //sending to all clients in 'game' room(channel), include sender

// io.of('myNamespace').emit('message', 'gg'); //sending to all clients in namespace 'myNamespace', include sender

// socket.emit(); //send to all connected clients

// socket.broadcast.emit(); //send to all connected clients except the one that sent the message

// socket.on(); //event listener, can be called on client to execute on server

// io.sockets.socket(); //for emiting to specific clients

// io.sockets.emit(); //send to all connected clients (same as socket.emit)

// io.sockets.on() ; //initial connection from a client.

