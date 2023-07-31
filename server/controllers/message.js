import Message from "../models/message.js";
import Chatspace from "../models/chatspace.js";
import {checkIsProvided,invalidDataResponse} from "../utils/checkIsProvided.js"

export const sendMessage = async (req,res,next) => {
    const {sender_id,chatspace_id,content} = req.body;
    const value = checkIsProvided(sender_id,chatspace_id,content)
    if(!value){
        return invalidDataResponse(res,sender_id,chatspace_id,content)
    }
    try {
        const chatspace = await Chatspace.findOne({
            _id: chatspace_id,
            between: {$in : [sender_id]}
        })
        if(!chatspace){
            return res.status(404).json({
                responseCode: 404,
                responseText: "Chatspace does not exist",
                requestBody: {
                    sender_id, chatspace_id
                }
            })
        }
        const receiver = chatspace.between.filter(_id => _id != sender_id)
        const message = new Message({
            belongsTo: chatspace._id,
            content,
            sender: sender_id,
            receiver: receiver[0],
            status: 0,
            deletedFor: []
        })
        const sentMessage = await message.save()
        chatspace.messages.push(sentMessage._id)
        await chatspace.save() 
        return res.status(201).json({
            responseCode: 201,
            responseText: "Message sent successfully",
            result : {
                sentMessage
            }
        })
    } catch (error) {
        next(error)
    }
}


