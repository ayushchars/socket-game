import mongoose from "mongoose";


const UserSchema = new mongoose.Schema({
    name: {
        type : String,
        required : true,
        trim  :true
    },
    email :{ 
        type : String,
        required  :true,
        unique : true
    },
    password :{ 
        type : String,
        required  :true,
    },
    points :{ 
        type : Number,
        required  :true,
        default : 0,
    },
    isOnline: {
        type: Boolean,
        default: false
    }, 
    isBlocked: {
        type: Boolean,
        default: false
      },
    role: {
        type: String,
        enum : ["USER","ADMIN"],
        default : "USER",
      },

},{timestamps : true})

export default mongoose.model("Users",UserSchema)