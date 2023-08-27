import Chatspace from "../models/chatspace.js";
import Contact from "../models/contact.js";
import Message from "../models/message.js";
import User from "../models/user.js";
import socketIo_config from "../configs/socket.io_config.js";

export const getUserChatSpace = async (req, res, next) => {
  const { user_id } = req.params;
  try {
    const chatspaces = await Chatspace.find({
      between: { $in: [user_id] },deletedFor:{$nin:[user_id]}
    })
      .populate({ path: "between", model: "User" })
      .sort({ updatedAt: -1 })
      .exec();
    const userContacts = await Contact.find({ saved_by: user_id });

    const modifiedChatSpaces = chatspaces.map((c) => {
      const connected_to = c.between.find(
        (otherUser) => !otherUser._id.equals(user_id)
      );
      const savedContact = userContacts.find((c) => {
        return c.contact.toString() == connected_to._id.toString();
      });
      const receiver = {
        connected_to,
        contact: savedContact,
        isSaved: savedContact ? true : false,
      };
      const sender = c.between.find((c) => c._id.equals(user_id));
      return {
        sender,
        receiver: receiver,
        _id: c._id,
      };
    });

    return res.status(200).json({
      responseCode: 200,
      responseMessage: "Retrieving all chatspaces Successful",
      result: {
        chatspaces: modifiedChatSpaces,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createChatSpace = async (req, res, next) => {
  const { user_id, public_numbers,textMessage } = req.body;
  try {
    const doesExist = await Chatspace.findOne({
      public_numbers: { $all: public_numbers }, // Look where all the ids of between matches inside a chat space
    })
      .populate("between")
      .exec();
    if (doesExist) {
      return res.status(200).json({
        responseCode: 200,
        responseMessage: "Chat Space Alreay Exist",
        result: {
          chatspace: doesExist,
        },
      });
    }
    let between = [];
    let users = [];
    for (let i = 0; i < public_numbers.length; i++) {
      const user = await User.findOne({ public_number: public_numbers[i] });
      if (!user) {
        return res.status(400).json({
          responseCode: 400,
          responseMessage: "Bad request",
          body: {
            public_numbers,
          },
        });
      }
      between[i] = user._id;
      users[i] = user;
    }
    const newChatspace = new Chatspace({
      between,
      public_numbers,
    });
    await newChatspace.save();
    const connected_to = users.find((u) => !u._id.equals(user_id));
    const savedContact = await Contact.findOne({
      saved_by: user_id,
      public_number: connected_to.public_number,
    });
    const receiver = {
      connected_to,
      contact: savedContact,
      isSaved: savedContact ? true : false,
    };
    const sender = users.find((c) => c._id.equals(user_id));
    const modifiedChatspace = {
      _id: newChatspace._id,
      sender,
      receiver,
    };

    const message = new Message({
        belongsTo: newChatspace._id,
        content: textMessage,
        contentType: "text",
        sender: sender._id,
        receiver: receiver.connected_to._id,
        createdAt:new Date().toString(),
        status: 1,
        deletedFor: [],
        deletedForEveryone:false
    })

    await message.save()

    const io = socketIo_config.getIO()
    const modifiedMessage = {
        ...message._doc,sender
    }

    // Just shuffling the sender receiver for the other user
    const io_connected_to = users.find((u) => u._id.equals(user_id));
    const io_sender = receiver.connected_to
    const io_savedContact = await Contact.findOne({
      saved_by: io_sender._id,
      public_number: io_connected_to.public_number,
    });
    const io_receiver = {
      connected_to:io_connected_to,
      contact: io_savedContact,
      isSaved: io_savedContact ? true : false,
    };
    const ioChatSpace = {
        _id: newChatspace._id,
        sender:io_sender,
        receiver:io_receiver,
    }
    io.to(receiver.connected_to.socketId).emit("new-messager",{chatspace:ioChatSpace,message:modifiedMessage})


    return res.status(201).json({
      responseCode: 201,
      responseMessage: "Created a new ChatSpace",
      result: {
        chatspace: modifiedChatspace,
        message:modifiedMessage
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getAllChatspaceMessages = async (req, res, next) => {
  const { user_id, skip } = req.params;
  const chatspaces = await Chatspace.find({ between: { $in: [user_id] } });
  const allChatspaceMessages = [];
  for (let i = 0; i < chatspaces.length; i++) {
    const totalMessages = await Message.countDocuments({
      belongsTo: chatspaces[i],
    });
    const skipCount = Math.max(totalMessages - 20, 0);
    const messages = await Message.find({
      belongsTo: chatspaces[i],
      deletedFor: { $nin: [user_id] },
    })
      .skip(skipCount)
      .limit(20)
      .populate({ path: "sender", model: "User" })
      .populate({ path: "receiver", model: "User" });

    allChatspaceMessages.push({
      chatspace_id: chatspaces[i]._id,
      messages: messages,
    });
  }
  return res.status(200).json({
    responseCode: 200,
    responseMessage: "Fetched chatSpace successfully",
    result: {
      allChatspaceMessages,
    },
  });
};

export const deleteAllMessageOfAChatSpace = async (req,res,next) => {
   const {user_id} = req.params 
   const {chatspace_id} = req.querry
   try {
     const updateCount = await Message.updateMany({belongsTo: chatspace_id},{$push:{deletedFor:user_id}})
     return res.status(200).json({
       responseCode: 200,
       responseMessage: "Fetched chatSpace successfully",
       result: {
         updateCount,
        },
      })
   } catch (error) {
    next(error)
   }
}
