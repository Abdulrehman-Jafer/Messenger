import { Schema,model,Types } from "mongoose";

// aggregation $project $match $group $sum

const schema = new Schema({
        belongsTo: {
            type: Types.ObjectId,
            ref: "ChatSpace",
            index: true,
            required: true
        },
        contentType: {
            type: String, //text //video // image (maybe audio)
            required: true
        },
        content: 
        {
            type: String,
            required: true,
        },
        sender: 
        {
            type: Types.ObjectId,
            ref: "User",
            required: true
        },
        receiver: 
        {
            type: Types.ObjectId,
            ref:"User",
            required: true
        },
        status: 
        {
            type: Number,
            default: 0
        },
        deletedFor: [
        { 
            type: Types.ObjectId,
            ref: "User"
        }],
        deletedForEveryone: 
        {
            type: Boolean,
            default: false
        }
},{timestamps:true})

const Message = new model("Message",schema)
export default Message;