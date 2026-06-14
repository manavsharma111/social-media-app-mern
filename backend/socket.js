import http from "http"
import express from "express"
import { Server } from "socket.io"
const app=express()
const server=http.createServer(app)

const io=new Server(server,{
    cors:{
        origin:"http://localhost:5173",
        methods:["GET","POST"]
    }
})

const userSocketMap={}

export const getSocketId=(receiverId)=>{
return userSocketMap[receiverId]
}

io.on("connection",(socket)=>{
   const userId=socket.handshake.query.userId
   if(userId!=undefined){
    userSocketMap[userId]=socket.id
   }

 io.emit('getOnlineUsers',Object.keys(userSocketMap))  

socket.on('typing', (data) => {
    const receiverSocketId = getSocketId(data.receiverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit('typing', { senderId: data.senderId });
    }
});

socket.on('stopTyping', (data) => {
    const receiverSocketId = getSocketId(data.receiverId);
    if(receiverSocketId){
        io.to(receiverSocketId).emit('stopTyping', { senderId: data.senderId });
    }
});


// WebRTC Signaling
socket.on("callUser", (data) => {
    const receiverSocketId = getSocketId(data.userToCall);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("callUser", { signal: data.signalData, from: data.from, callType: data.callType });
    }
});

socket.on("answerCall", (data) => {
    const callerSocketId = getSocketId(data.to);
    if(callerSocketId){
        io.to(callerSocketId).emit("callAccepted", data.signal);
    }
});

socket.on("iceCandidate", (data) => {
    const receiverSocketId = getSocketId(data.to);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("iceCandidate", data.candidate);
    }
});

socket.on("cameraToggled", (data) => {
    const receiverSocketId = getSocketId(data.to);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("cameraToggled", data.isVideoOn);
    }
});

socket.on("endCall", (data) => {
    const receiverSocketId = getSocketId(data.to);
    if(receiverSocketId){
        io.to(receiverSocketId).emit("endCall");
    }
});


socket.on('disconnect',()=>{
    if(userSocketMap[userId] === socket.id){
        delete userSocketMap[userId]
    }
    io.emit('getOnlineUsers',Object.keys(userSocketMap))  
})

})


export {app,io, server}