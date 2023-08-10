import { Schema,Types,model, } from "mongoose";


const schema = new Schema({
    provider: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: function () {
          return this.provider == "Custom"
        }
    },
    google_uid: {
        type: String,
        required: function(){
            return this.provider == "Google"
        }
    },
    blockedContacts: [
        {
            type: Types.ObjectId,
            required: true
        }
    ],
    lastLogin: {
      type:  Number,
      default: 0
    },
    socketId : {
        type: String, 
        default: ""
    },
    public_number: {
        type: String,
        unique: true,
        required: true
    }
},{timestamps:true})


const User = new model("User",schema)
export default User;



