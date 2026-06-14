import express from "express"
import isAuth from "../middlewares/isAuth.js"

import { upload } from "../middlewares/multer.js"
import { comment, getAllLoops, like, uploadLoop, deleteLoop } from "../controllers/loop.controllers.js"



const loopRouter=express.Router()

loopRouter.post("/upload",isAuth,upload.fields([{ name: "media", maxCount: 1 }, { name: "audio", maxCount: 1 }]),uploadLoop)
loopRouter.get("/getAll",isAuth,getAllLoops)
loopRouter.get("/like/:loopId",isAuth,like)

loopRouter.post("/comment/:loopId",isAuth,comment)
loopRouter.delete("/delete/:loopId",isAuth,deleteLoop)

export default loopRouter