import express from "express"
import isAuth from "../middlewares/isAuth.js"

import { upload } from "../middlewares/multer.js"
import { getAllMessages, getPrevUserChats, sendMessage, editMessage, deleteMessage, deleteMessageForMe, reactToMessage, markMessagesAsRead } from "../controllers/message.controllers.js"




const messageRouter=express.Router()

messageRouter.post("/send/:receiverId",isAuth,upload.single("image"),sendMessage)
messageRouter.get("/getAll/:receiverId",isAuth,getAllMessages)
messageRouter.get("/prevChats",isAuth,getPrevUserChats)
messageRouter.put("/edit/:messageId",isAuth,editMessage)
messageRouter.delete("/delete/:messageId",isAuth,deleteMessage)
messageRouter.delete("/deleteForMe/:messageId",isAuth,deleteMessageForMe)
messageRouter.post("/react/:messageId",isAuth,reactToMessage)
messageRouter.put("/markAsRead/:senderId",isAuth,markMessagesAsRead)



export default messageRouter