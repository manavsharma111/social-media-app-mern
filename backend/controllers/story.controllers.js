import uploadOnCloudinary from "../config/cloudinary.js"
import Story from "../models/story.model.js"
import User from "../models/user.model.js"

export const uploadStory = async (req, res) => {
    try {
        const user = await User.findById(req.userId)
        if (user.story) {
            await Story.findByIdAndDelete(user.story)
            user.story = null
        }

        const { mediaType } = req.body

        let media;
        let audio;
        if (req.files && req.files.media) {
            media = await uploadOnCloudinary(req.files.media[0].path)
        } else if (req.file) {
            media = await uploadOnCloudinary(req.file.path)
        } else {
            return res.status(400).json({ message: "media is required" })
        }
        
        if (req.files && req.files.audio) {
            audio = await uploadOnCloudinary(req.files.audio[0].path, 'auto')
        }

        const story = await Story.create({
            author: req.userId, mediaType, media, audio
        })
        user.story = story._id
        await user.save()
        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage")
        return res.status(200).json(populatedStory)
    } catch (error) {
        return res.status(500).json({ message: "story upload error" })
    }
}

export const viewStory = async (req, res) => {
    try {
        const storyId = req.params.storyId
        const story = await Story.findById(storyId)

        if (!story) {
            return res.status(400).json({ message: "story not found" })
        }

        const viewersIds = story.viewers.map(id => id.toString())
        if (!viewersIds.includes(req.userId.toString())) {
            story.viewers.push(req.userId)
            await story.save()
        }

        const populatedStory = await Story.findById(story._id).populate("author", "name userName profileImage")
            .populate("viewers", "name userName profileImage")
        return res.status(200).json(populatedStory)
    } catch (error) {
        return res.status(500).json({ message: "story view error" })
    }
}


export const getStoryByUserName=async (req,res)=>{
    try {
        const userName=req.params.userName
        const user=await User.findOne({userName})
        if(!user){
             return res.status(400).json({ message: "user not found" })
        }

        const story=await Story.find({
            author:user._id
        }).populate("viewers author")

         return res.status(200).json(story)
    } catch (error) {
         return res.status(500).json({ message: "story get by userName error" })
    }
}

export const getAllStories=async (req,res)=>{
    try {
        const currentUser=await User.findById(req.userId)
        const followingIds=currentUser.following

        const stories=await Story.find({
            author:{$in:followingIds}
        }).populate("viewers author")
           .sort({createdAt:-1})

           return res.status(200).json(stories)


    } catch (error) {
           return res.status(500).json({ message: "All story get error" })
    }
}

export const deleteStory = async (req, res) => {
    try {
        const storyId = req.params.storyId;
        const story = await Story.findById(storyId);
        if(!story) return res.status(404).json({message: "Story not found"});
        if(story.author.toString() !== req.userId) return res.status(403).json({message: "Unauthorized"});
        
        await Story.findByIdAndDelete(storyId);
        await User.findByIdAndUpdate(req.userId, { story: null });
        
        return res.status(200).json({message: "Story deleted successfully", storyId});
    } catch (error) {
        return res.status(500).json({ message: `delete story error ${error}` })
    }
}

export const likeStory = async (req, res) => {
    try {
        const storyId = req.params.storyId
        const story = await Story.findById(storyId)
        if (!story) {
            return res.status(400).json({ message: "story not found" })
        }

        const alreadyLiked = story.likes.some(id => id.toString() == req.userId.toString())

        if (alreadyLiked) {
            story.likes = story.likes.filter(id => id.toString() != req.userId.toString())
        } else {
            story.likes.push(req.userId)
            // Can add notification here if needed
        }

        await story.save()
        await story.populate("author", "name userName profileImage")
        await story.populate("viewers", "name userName profileImage")
        return res.status(200).json(story)
    } catch (error) {
        return res.status(500).json({ message: `like story error ${error}` })
    }
}