
import Chatspace from "../models/chatspace.js"
import Message from "../models/message.js"
import User from "../models/user.js"
import { returnResponse } from "../utils/response.js"



export const whetherChatspaceExist = async (req,res,next) => {
    const {data,messageFrom} = req.body;
   try {
       const chatspace = await Chatspace.findOne({
           _id: data.belongsTo,
           between: {$in : [data.sender._id]}
       })
       if(!chatspace){
          return returnResponse(res,404,"Chatspace does not exist",{data,messageFrom},false)
       }
       next()
      }
      catch(error) {
         error.location = "whetherChatspaceExist"
         next(error)
      }
  }

export const checkWhetherUserBlocked = async (req,res,next) => {
    const {data} = req.body;
     try {
            const isBlockedBySender = await User.exists({_id:data.sender._id,blocked_user:{$in:[data.receiver]}})
            if(isBlockedBySender)  return returnResponse(res,401,"Unblock the user to chat",data,false)
            const isBlockedByReceiver = await User.exists({_id: data.receiver,blocked_user:{$in:[data.sender._id]}})
            console.log({isBlockedByReceiver,isBlockedBySender})
            if(!isBlockedByReceiver) return next();
            const message = new Message({
                 belongsTo: data.belongsTo,
                 content: data.content,
                 contentType: "text",
                 sender: data.sender._id,
                 receiver: data.receiver,
                 createdAt:data.createdAt,
                 status: 1,
                 deletedFor: [data.receiver],
                 deletedForEveryone:false
             })
           const savedMessage =  await message.save()
           const modifiedMessage = {...savedMessage._doc,sender: data.sender}
           return returnResponse(res,201,"Message sent successfully",{sentMessage:modifiedMessage},true)
     } catch (error) {
        error.location = "checkWhetherUserBlocked"
        next(error)
     }
 }

