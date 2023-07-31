import { Schema,model,Types } from "mongoose";

const schema = new Schema({
        belongsTo: {
            type: Types.ObjectId,
            ref: "ChatSpace"
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
        status: Number,
        deletedFor:[
            {
                type:Types.ObjectId,
                ref:"User"
            }
        ],
},{timestamps:true})

export default new model("Message",schema)