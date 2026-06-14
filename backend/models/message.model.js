import mongoose from "mongoose";

const messageSchema=new mongoose.Schema({
sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
},
receiver:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User" 
},
message:{
   type:String 
},
image:{
    type:String  
},
fileType:{
    type:String
},
reaction:{
    type:String
},
edited:{
    type:Boolean,
    default:false
},
deletedBy:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User"
}],
isDeletedForEveryone: {
    type: Boolean,
    default: false
},
isRead: {
    type: Boolean,
    default: false
}
},{timestamps:true})

const Message=mongoose.model("Message",messageSchema)
export default Message