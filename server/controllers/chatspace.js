import Chatspace from "../models/chatspace.js";
import Contact from "../models/contact.js";

export const getUserChatSpace = async (req,res,next) => {
    const { user_id } = req.params
    try {
        const chatspaces = await Chatspace.find({
            between: {$in: [user_id]}
        }).populate({path:"between",model:"User"}).populate({path:"messages",model:"Message"}).exec()

        const userContacts = await Contact.find({ saved_by : user_id})

const modifiedChatSpaces = chatspaces.map(c => {
    const connected_to = c.between.find(otherUser => !otherUser._id.equals(user_id))
    const savedContact = userContacts.find(c => {
        return c.contact.toString() == connected_to._id.toString()
    });
    const receiver = { connected_to, contact: savedContact, isSaved: savedContact ? true : false };
    const sender = c.between.find(c => c._id.equals(user_id));
    return {
        sender,receiver: receiver,messages: c.messages,_id: c._id
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

// export const getChatSpace = async (req,res,next) => {
//     const {chatspace_id} = req.params;
//     try {
//         const chatspace = await Chatspace.findOne({_id : chatspace_id}).
//         populate({path:"between",model:"User"}).populate({path:"messages",model:"Message"})
//         const connected_to = c.between.find(otherUser => !otherUser._id.equals(user_id))
//         res.status(200).json({
//             responseCode: 200,
//             responseMessage: "Fetched chatSpace successfully",
//             result: {
//                 chatspace
//             }
//         })
//     } catch (error) {
//         error.text = "Error In getting Chatspace"
//         next(error)
//     }
    
// }