import { Schema,model,Types } from "mongoose";

const schema = new Schema({
    between: [
        {
            type:Types.ObjectId,
            ref:"User"
        }
    ],
    messages: [
        {
        type: Types.ObjectId,
        ref:"Message"
    }
]
},{timestamps:true})

const Chatspace = new model("Chatspace",schema)
export default Chatspace;