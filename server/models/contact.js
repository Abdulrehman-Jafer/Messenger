import { Schema,Types,model, } from "mongoose";

const schema = new Schema({
        contact: 
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
            index:true,
            required: true,
        },
        public_number: {
            type: String,
            required: true
        }
})

const Contact = new model("Contact",schema)

export default Contact;