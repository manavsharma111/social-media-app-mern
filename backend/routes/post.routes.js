import express from "express"
import isAuth from "../middlewares/isAuth.js"

import { upload } from "../middlewares/multer.js"
import { comment, getAllPosts, like, saved, uploadPost, deletePost, editPost, likeComment, deleteComment, replyComment, deleteReply } from "../controllers/post.controllers.js"


const postRouter=express.Router()

postRouter.post("/upload",isAuth,upload.fields([{ name: "media", maxCount: 10 }, { name: "audio", maxCount: 1 }]),uploadPost)
postRouter.get("/getAll",isAuth,getAllPosts)
postRouter.get("/like/:postId",isAuth,like)
postRouter.get("/saved/:postId",isAuth,saved)
postRouter.post("/comment/:postId",isAuth,comment)
postRouter.delete("/delete/:postId",isAuth,deletePost)
postRouter.put("/edit/:postId",isAuth,editPost)
postRouter.get("/comment/like/:postId/:commentId",isAuth,likeComment)
postRouter.delete("/comment/delete/:postId/:commentId",isAuth,deleteComment)
postRouter.post("/comment/reply/:postId/:commentId",isAuth,replyComment)
postRouter.delete("/comment/reply/delete/:postId/:commentId/:replyId",isAuth,deleteReply)

export default postRouter