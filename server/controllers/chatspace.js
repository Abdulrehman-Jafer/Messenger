import Chatspace from "../models/chatspace.js";
import Contact from "../models/contact.js";
import Message from "../models/message.js";

export const getUserChatSpace = async (req,res,next) => {
    const { user_id } = req.params
    try {
        const chatspaces = await Chatspace.find({
            between: {$in: [user_id]}
        }).populate({path:"between",model:"User"}).sort({updatedAt: -1}).exec()

        const userContacts = await Contact.find({ saved_by : user_id}) 

const modifiedChatSpaces = chatspaces.map(c => {
    const connected_to = c.between.find(otherUser => !otherUser._id.equals(user_id))
    const savedContact = userContacts.find(c => {
        return c.contact.toString() == connected_to._id.toString()
    });
    const receiver = { connected_to, contact: savedContact, isSaved: savedContact ? true : false };
    const sender = c.between.find(c => c._id.equals(user_id));
    return {
        sender,receiver: receiver,_id: c._id
    }
})

return res.status(200).json({
  responseCode: 200,
  responseMessage: "Retrieving all chatspaces Successful",
  result: {
    chatspaces: modifiedChatSpaces
  }
});
    } catch (error) {
        next (error)
    }
} 

export const createChatSpace = async (req,res,next) => {
    const {between} = req.body
    try {
        const doesExist = await Chatspace.findOne({
            between : {$all: between} // Look where all the ids of between matches inside a chat space
        }).populate("between").exec()
        if(doesExist){
           return res.status(200).json({
                responseCode: 200,
                responseMessage:"Chat Space Alreay Exist",
                result:{
                    chatspace: doesExist
                }
            })
        }
        const newChatspace = new Chatspace({
            between,
        })
        const savedChatSpace = await newChatspace.save()
        return res.status(201).json({
            responseCode: 201,
            responseMessage:"Created a new ChatSpace",
            result:{
                chatspace: savedChatSpace
            }
        })
    } catch (error) {
        next(error)
    }
}

export const getAllChatspaceMessages = async (req,res,next) => {
    const {user_id,skip} = req.params;
    const chatspaces = await Chatspace.find({between:{$in:[user_id]}})
    const allChatspaceMessages = []
    for(let i=0; i<chatspaces.length; i++){
        const totalMessages = await Message.countDocuments({belongsTo : chatspaces[i]})
        const skipCount = Math.max(totalMessages - 20, 0);
        const messages = await Message.find({belongsTo : chatspaces[i],deletedFor: {$nin: [user_id] },deletedForEveryone: false}).
            skip(skipCount).limit(20).populate({path:"sender",model:"User"}).
            populate({path:"receiver",model:"User"})

        allChatspaceMessages.push({
            chatspace_id: chatspaces[i]._id,
            messages:messages
        })
    }
    return res.status(200).json({
            responseCode: 200,
            responseMessage: "Fetched chatSpace successfully",
            result: {
                allChatspaceMessages
            }
    })
}