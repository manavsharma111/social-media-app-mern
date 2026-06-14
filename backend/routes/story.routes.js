import express from "express"
import isAuth from "../middlewares/isAuth.js"

import { upload } from "../middlewares/multer.js"
import { getAllStories, getStoryByUserName, uploadStory, viewStory, deleteStory, likeStory } from "../controllers/story.controllers.js"



const storyRouter=express.Router()

storyRouter.post("/upload",isAuth,upload.fields([{ name: "media", maxCount: 1 }, { name: "audio", maxCount: 1 }]),uploadStory)
storyRouter.get("/getByUserName/:userName",isAuth,getStoryByUserName)
storyRouter.get("/getAll",isAuth,getAllStories)
storyRouter.get("/view/:storyId",isAuth,viewStory)
storyRouter.delete("/delete/:storyId",isAuth,deleteStory)
storyRouter.post("/like/:storyId",isAuth,likeStory)


export default storyRouter