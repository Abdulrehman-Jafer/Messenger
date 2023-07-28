import Chatspace from "../models/chatspace.js";
import Contact from "../models/contact.js";

export const getUserChatSpace = async (req,res,next) => {
    const { user_id } = req.params
    try {
        const chatspaces = await Chatspace.find({
            between: {$in: [user_id]}
        }).populate({path:"between",model:"User"}).populate({path:"messages",model:"Message"}).exec()
        // .populate({
        //     path:"messages",
        //     model:"Message"
        // })
        const userContacts = await Contact.find({
            saved_by : user_id
        })

const modifiedChatSpaces = chatspaces.map(c => {
    const receiverUser = c.between.find(_id => _id != user_id);
    const savedContact = userContacts.find(c => c.contact == receiverUser._id);
    const receiver = { user: receiverUser, contact: savedContact, isSaved: savedContact ? true : false };
    const sender = c.between.find(c => c._id == user_id);
    return {
        sender,receiver: receiver,messages: c.messages
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
        }).populate("between","messages").exec()
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
            messsages: []
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