import { Schema,model,Types } from "mongoose";

const schema = new Schema({
    between: [
        {
            type:Types.ObjectId,
            ref:"User"
        }
    ],
    public_numbers: [
        {
            type: String,
            required: true
        }
    ]
 // Will use as room will add isGroup boolean maybe
},{timestamps:true})

const Chatspace = new model("Chatspace",schema)
export default Chatspace;