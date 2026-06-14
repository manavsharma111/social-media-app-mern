import uploadOnCloudinary from "../config/cloudinary.js";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import { getSocketId, io } from "../socket.js";

export const sendMessage=async (req,res)=>{
    try {
        const senderId=req.userId
        const receiverId=req.params.receiverId
        const {message}=req.body

        let image;
        let fileType;
        if(req.file){
            fileType = req.file.mimetype;
            let rt = 'auto';
            if(!fileType.includes('image') && !fileType.includes('video') && !fileType.includes('audio')) {
                rt = 'raw';
            }
            image=await uploadOnCloudinary(req.file.path, rt)
        }

        const newMessage=await Message.create({
            sender:senderId,
            receiver:receiverId,
            message,
            image,
            fileType
        })

        let conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        })
        if(!conversation){
            conversation=await Conversation.create({
                participants:[senderId,receiverId],
                messages:[newMessage._id]
            })
        }else{
conversation.messages.push(newMessage._id)
await conversation.save()
        }

const receiverSocketId=getSocketId(receiverId)
if(receiverSocketId){
io.to(receiverSocketId).emit("newMessage",newMessage)
}

return res.status(200).json(newMessage)
    } catch (error) {
        return res.status(500).json({message:`send Message error ${error}`})
    }
}

export const getAllMessages=async (req,res)=>{
    try {
         const senderId=req.userId
        const receiverId=req.params.receiverId
        const conversation=await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate("messages")

        if (!conversation) return res.status(200).json([]);

        // Filter out messages that the user has deleted for themselves
        const visibleMessages = conversation.messages.filter(msg => !msg.deletedBy.includes(senderId));

        return res.status(200).json(visibleMessages)

    } catch (error) {
           return res.status(500).json({message:`get Message error ${error}`})
    }
}

export const getPrevUserChats = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const conversations = await Conversation.find({
            participants: currentUserId
        }).populate("participants").populate("messages").sort({ updatedAt: -1 });

        const userMap = {};
        conversations.forEach(conv => {
            const otherUser = conv.participants.find(user => user._id.toString() !== currentUserId);
            
            if (otherUser) {
                const visibleMessages = conv.messages.filter(msg => !msg.deletedBy.includes(currentUserId));
                
                let lastMessage = null;
                let unreadCount = 0;

                if (visibleMessages.length > 0) {
                    lastMessage = visibleMessages[visibleMessages.length - 1];
                    unreadCount = visibleMessages.filter(msg => 
                        msg.receiver.toString() === currentUserId && !msg.isRead
                    ).length;
                }

                if (!userMap[otherUser._id]) {
                    const userObj = otherUser.toObject();
                    userObj.lastMessage = lastMessage;
                    userObj.unreadCount = unreadCount;
                    userMap[otherUser._id] = userObj;
                }
            }
        });

        const previousUsers = Object.values(userMap);
        previousUsers.sort((a, b) => {
            const timeA = a.lastMessage ? new Date(a.lastMessage.createdAt).getTime() : 0;
            const timeB = b.lastMessage ? new Date(b.lastMessage.createdAt).getTime() : 0;
            return timeB - timeA;
        });

        return res.status(200).json(previousUsers);

    } catch (error) {
        return res.status(500).json({ message: `prev user error ${error}` });
    }
}

export const editMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const { message } = req.body;
        const existingMessage = await Message.findById(messageId);
        
        if(!existingMessage) return res.status(404).json({message: "Message not found"});
        if(existingMessage.sender.toString() !== req.userId) return res.status(403).json({message: "Unauthorized"});

        existingMessage.message = message;
        existingMessage.edited = true;
        await existingMessage.save();

        const receiverSocketId = getSocketId(existingMessage.receiver);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("messageEdited", existingMessage);
        }

        return res.status(200).json(existingMessage);
    } catch (error) {
        return res.status(500).json({message:`edit message error ${error}`})
    }
}

export const deleteMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const existingMessage = await Message.findById(messageId);
        
        if(!existingMessage) return res.status(404).json({message: "Message not found"});
        if(existingMessage.sender.toString() !== req.userId) return res.status(403).json({message: "Unauthorized"});

        const receiver = existingMessage.receiver;
        
        existingMessage.message = "🚫 This message was deleted";
        existingMessage.image = null;
        existingMessage.fileType = null;
        existingMessage.reaction = null;
        existingMessage.isDeletedForEveryone = true;
        
        await existingMessage.save();

        const receiverSocketId = getSocketId(receiver);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("messageEdited", existingMessage);
        }

        return res.status(200).json(existingMessage);
    } catch (error) {
        return res.status(500).json({message:`delete message error ${error}`})
    }
}

export const deleteMessageForMe = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const userId = req.userId;
        const existingMessage = await Message.findById(messageId);
        
        if(!existingMessage) return res.status(404).json({message: "Message not found"});
        
        // Ensure user is either sender or receiver
        if (existingMessage.sender.toString() !== userId && existingMessage.receiver.toString() !== userId) {
            return res.status(403).json({message: "Unauthorized"});
        }

        if (!existingMessage.deletedBy.includes(userId)) {
            existingMessage.deletedBy.push(userId);
            await existingMessage.save();
        }

        return res.status(200).json({message: "Message deleted for you", messageId});
    } catch (error) {
        return res.status(500).json({message:`delete message for me error ${error}`})
    }
}

export const reactToMessage = async (req, res) => {
    try {
        const messageId = req.params.messageId;
        const { reaction } = req.body;
        const existingMessage = await Message.findById(messageId);
        
        if(!existingMessage) return res.status(404).json({message: "Message not found"});

        if (existingMessage.reaction === reaction) {
            existingMessage.reaction = "";
        } else {
            existingMessage.reaction = reaction;
        }
        
        await existingMessage.save();

        const senderSocketId = getSocketId(existingMessage.sender);
        if(senderSocketId){
            io.to(senderSocketId).emit("messageReacted", existingMessage);
        }

        return res.status(200).json(existingMessage);
    } catch (error) {
        return res.status(500).json({message:`react message error ${error}`})
    }
}

export const markMessagesAsRead = async (req, res) => {
    try {
        const currentUserId = req.userId;
        const senderId = req.params.senderId;

        // Find all unread messages where currentUserId is receiver and senderId is sender
        await Message.updateMany(
            { sender: senderId, receiver: currentUserId, isRead: { $ne: true } },
            { $set: { isRead: true } }
        );

        return res.status(200).json({ message: "Messages marked as read" });
    } catch (error) {
        return res.status(500).json({ message: `mark as read error ${error}` });
    }
}