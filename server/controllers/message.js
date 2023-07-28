import Message from "../models/message.js";
import Chatspace from "../models/chatspace.js";
import {checkIsProvided,invalidDataResponse} from "../utils/checkIsProvided.js"

export const createMessage = async (req,res,next) => {
    const {user_id,chatspace_id,content} = req.body;
    const value = checkIsProvided(user_id,chatspace_id,content)
    if(!value){
        return invalidDataResponse(res,user_id,chatspace_id,content)
    }
    try {
        const chatspace = await Chatspace.findOne({
            _id: chatspace_id,
            between: {$in : [user_id]}
        })
        if(!chatspace){
            return res.status(404).json({
                responseCode: 404,
                responseText: "Chatspace does not exist",
                requestBody: {
                    user_id, chatspace_id
                }
            })
        }
        console.log(chatspace)
        const receiver = chatspace.between.filter(_id => _id != user_id)
        console.log(receiver)
        const message = new Message({
            belongsTo: chatspace._id,
            content,
            sender: user_id,
            receiver: receiver[0],
            status: "sent",
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


