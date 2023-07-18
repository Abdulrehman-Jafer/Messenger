import { Schema,model,Types } from "mongoose";

const schema = new Schema({
    between: [
        {
            type:Types.ObjectId,
            ref:"User"
        }
    ],
    message: [
    {
        content: 
        {
            type: String,
            value:String,
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
            type: String,
            required: true,
        },
        deletedFor:[
            {
                type:Types.ObjectId,
                ref:"User"
            }
        ],
        createdAt: 
        {
            type: Number,
            required: true
        }
    }
]
},{timestamps})

export default new model("chatspace",schema)