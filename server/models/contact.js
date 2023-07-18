import { Schema,Types,model, } from "mongoose";

const schema = new Schema({
        contact_id: 
        {
         type: Types.ObjectId,
         ref: "User",
         required:true
        },
        saved_as: {
            type:String,
            required: true
        },
        saved_by:{
            type: Types.ObjectId,
            ref: "User",
            required: true
        }
})