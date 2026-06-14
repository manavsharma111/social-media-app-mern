import React, { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { LuImage } from "react-icons/lu";
import { IoMdSend } from "react-icons/io";
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import dp from "../assets/dp.webp"
import SenderMessage from '../components/SenderMessage';
import axios from 'axios';
import { serverUrl } from '../App';
import { setMessages, markUserAsRead } from '../redux/messageSlice';
import ReceiverMessage from '../components/ReceiverMessage';
import { MdCall, MdVideocam } from "react-icons/md";
import { setOutgoingCall } from '../redux/callSlice';
function MessageArea() {
  const {selectedUser,messages}=useSelector(state=>state.message)
    const {userData}=useSelector(state=>state.user)
       const {socket}=useSelector(state=>state.socket)
  const navigate=useNavigate()
  const [input,setInput]=useState("")
  const dispatch=useDispatch()
  const imageInput=useRef()
const [frontendFileUrl, setFrontendFileUrl] = useState(null)
const [backendFile, setBackendFile] = useState(null)
const [fileType, setFileType] = useState(null)
const [showEmojiPicker,setShowEmojiPicker]=useState(false)
const [isOtherTyping, setIsOtherTyping] = useState(false)
const typingTimeoutRef = useRef(null)

const handleImage=(e)=>{
const file=e.target.files[0]
setBackendFile(file)
setFileType(file.type)
setFrontendFileUrl(URL.createObjectURL(file))
}

const handleEmojiClick = (emojiObject) => {
    setInput(prev => prev + emojiObject.emoji);
};

const handleSendMessage=async (e)=>{
  e.preventDefault()
  try {
    const formData=new FormData()
    formData.append("message",input)
    if(backendFile){
       formData.append("image",backendFile)
    }
    const result=await axios.post(`${serverUrl}/api/message/send/${selectedUser._id}`,formData,{withCredentials:true})
    dispatch(setMessages([...messages,result.data]))
    setInput("")
    setBackendFile(null)
    setFrontendFileUrl(null)
    setFileType(null)
    socket?.emit("stopTyping", { senderId: userData._id, receiverId: selectedUser._id });
  } catch (error) {
    console.log(error)
  }
}

const handleTyping = (e) => {
    setInput(e.target.value);
    
    socket?.emit("typing", { senderId: userData._id, receiverId: selectedUser._id });
    
    if(typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    
    typingTimeoutRef.current = setTimeout(() => {
        socket?.emit("stopTyping", { senderId: userData._id, receiverId: selectedUser._id });
    }, 1500);
}

const getAllMessages=async ()=>{
  try {
    // 1. Mark messages as read in DB first
    await axios.put(`${serverUrl}/api/message/markAsRead/${selectedUser._id}`, {}, {withCredentials:true})
    
    // 2. Fetch all messages
    const result=await axios.get(`${serverUrl}/api/message/getAll/${selectedUser._id}`,{withCredentials:true})
    
    // 3. Update messages in Redux (this triggers getPrevChatUsers hook)
    dispatch(setMessages(result.data))
    
    // 4. Instantly clear unread badge in Redux just in case
    dispatch(markUserAsRead(selectedUser._id));
  } catch (error) {
    console.log(error)
  }
}
useEffect(()=>{
getAllMessages()
},[])

useEffect(()=>{
socket?.on("newMessage",(mess)=>{
  dispatch(setMessages([...messages,mess]))
})
socket?.on("messageEdited", (editedMsg) => {
  dispatch(setMessages(messages.map(m => m._id === editedMsg._id ? editedMsg : m)));
});
socket?.on("messageDeleted", ({ messageId }) => {
  dispatch(setMessages(messages.filter(m => m._id !== messageId)));
});
socket?.on("messageReacted", (reactedMsg) => {
  dispatch(setMessages(messages.map(m => m._id === reactedMsg._id ? reactedMsg : m)));
});
return ()=>{
  socket?.off("newMessage")
  socket?.off("messageEdited")
  socket?.off("messageDeleted")
  socket?.off("messageReacted")
}
},[messages,setMessages])

useEffect(() => {
    const handleTypingEvent = (data) => {
        if(data.senderId === selectedUser._id) setIsOtherTyping(true);
    };
    const handleStopTypingEvent = (data) => {
        if(data.senderId === selectedUser._id) setIsOtherTyping(false);
    };
    
    socket?.on("typing", handleTypingEvent);
    socket?.on("stopTyping", handleStopTypingEvent);
    
    return () => {
        socket?.off("typing", handleTypingEvent);
        socket?.off("stopTyping", handleStopTypingEvent);
    }
}, [socket, selectedUser]);

  return (
    <div className='w-full h-[100vh] bg-[#e0e5ec] relative animate-explode origin-center'>
      
      <div className=' w-full flex items-center gap-[15px] px-[20px] py-[10px] h-[60px] fixed top-0 z-[100] bg-white/40 backdrop-blur-md border-b border-white/50 shadow-[0_4px_30px_rgba(0,0,0,0.1)] '>

<div className='flex items-center gap-[20px] pl-[10px] pr-[10px]'>
  <MdOutlineKeyboardBackspace 
      className='text-[#2d3748] cursor-pointer w-[25px] h-[25px]' 
      onClick={() => {
          if (window.innerWidth >= 1024) {
              navigate(`/`);
          } else {
              navigate(`/messages`);
          }
      }} 
  />
</div>

<div className='w-[40px] h-[40px] border-2 border-transparent shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-full cursor-pointer overflow-hidden flex-shrink-0' onClick={()=>navigate(`/profile/${selectedUser.userName}`)}>
          <img src={selectedUser.profileImage || dp} alt="" className='w-full h-full object-cover'/>
      </div>

      <div className='text-[#2d3748] flex flex-col justify-center'>
        <div className='text-[16px] leading-tight font-semibold'>{selectedUser.userName}</div>
        <div className='text-[12px] text-[#4a5568]'>{selectedUser.name}</div>
      </div>
   
      <div className='ml-auto flex items-center gap-4 pr-4'>
        <div className='w-[40px] h-[40px] rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center cursor-pointer text-[#4a5568] hover:text-[#2d3748]' onClick={() => dispatch(setOutgoingCall({ receiver: selectedUser, callType: 'audio' }))}>
          <MdCall className='w-[20px] h-[20px]' />
        </div>
        <div className='w-[40px] h-[40px] rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center cursor-pointer text-[#4a5568] hover:text-[#2d3748]' onClick={() => dispatch(setOutgoingCall({ receiver: selectedUser, callType: 'video' }))}>
          <MdVideocam className='w-[24px] h-[24px]' />
        </div>
      </div>

      </div>

      <div className='w-full h-[100dvh] pt-[80px] px-[15px] md:pl-[40px] md:pr-[60px] flex flex-col gap-[20px] overflow-y-auto overflow-x-hidden hide-scrollbar bg-[#e0e5ec] pb-[100px]'>
{(() => {
    const groups = {};
    (messages || []).forEach(msg => {
        const dateObj = new Date(msg.createdAt || Date.now());
        const today = new Date();
        const yesterday = new Date(today);
        yesterday.setDate(yesterday.getDate() - 1);
        
        let dateString = dateObj.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
        if (dateObj.toDateString() === today.toDateString()) {
            dateString = "Today";
        } else if (dateObj.toDateString() === yesterday.toDateString()) {
            dateString = "Yesterday";
        }
        
        if (!groups[dateString]) groups[dateString] = [];
        groups[dateString].push(msg);
    });

    return Object.keys(groups).map(date => (
        <div key={date} className="flex flex-col gap-[20px]">
            <div className="flex justify-center my-2">
                <span className="bg-white/50 text-[#4a5568] px-4 py-1 rounded-full text-xs font-bold shadow-[inset_2px_2px_5px_rgba(255,255,255,0.5),inset_-2px_-2px_5px_rgba(0,0,0,0.05)] border border-white/40">{date}</span>
            </div>
            {groups[date].map((mess, index) => 
                mess.sender == userData._id ? <SenderMessage message={mess} key={mess._id || index} /> : <ReceiverMessage message={mess} key={mess._id || index} />
            )}
        </div>
    ));
})()}

{isOtherTyping && (
  <div className='w-full flex justify-start mt-[-30px]'>
    <div className='bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-2xl px-[20px] py-[15px] flex items-center gap-[5px]'>
      <div className='w-[8px] h-[8px] bg-[#4a5568] rounded-full animate-bounce' style={{ animationDelay: '0ms' }}></div>
      <div className='w-[8px] h-[8px] bg-[#4a5568] rounded-full animate-bounce' style={{ animationDelay: '150ms' }}></div>
      <div className='w-[8px] h-[8px] bg-[#4a5568] rounded-full animate-bounce' style={{ animationDelay: '300ms' }}></div>
    </div>
  </div>
)}
      </div>

<div className='w-full h-[80px] fixed bottom-0 flex justify-center items-center bg-white/40 backdrop-blur-md border-t border-white/50 z-[100]'>
<form className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex items-center gap-[10px] px-[20px] relative' onSubmit={handleSendMessage}>
  {frontendFileUrl && (
    <div className='absolute top-[-120px] right-[10px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-2xl overflow-hidden p-[5px] flex items-center justify-center' style={{ width: '100px', height: '100px' }}>
      {fileType?.includes('image') ? (
        <img src={frontendFileUrl} alt="" className='w-full h-full object-cover rounded-xl'/>
      ) : fileType?.includes('video') ? (
        <video src={frontendFileUrl} className='w-full h-full object-cover rounded-xl' />
      ) : (
        <div className='text-[12px] font-bold text-center p-[10px] text-[#4a5568] break-all'>📎 Attached File</div>
      )}
      <div className='absolute top-[-5px] right-[-5px] bg-red-500 text-white rounded-full w-[20px] h-[20px] flex items-center justify-center cursor-pointer font-bold text-[12px]' onClick={(e)=>{e.preventDefault(); setFrontendFileUrl(null); setBackendFile(null); setFileType(null);}}>X</div>
    </div>
  )}
  
  <input type="file" hidden ref={imageInput} onChange={handleImage}/>
  
  <MdOutlineEmojiEmotions className='w-[28px] h-[28px] text-[#4a5568] hover:text-[#2d3748] cursor-pointer' onClick={() => setShowEmojiPicker(prev => !prev)} />
  
  {showEmojiPicker && (
      <div className='absolute bottom-[80px] left-[20px] z-[300] shadow-2xl'>
          <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" width={300} height={400}/>
      </div>
  )}

  <input type="text" placeholder='Message' className='w-full h-full px-[10px] text-[18px] text-[#4a5568] placeholder-[#a3b1c6] bg-transparent outline-0' onChange={handleTyping} value={input}/>
  <div onClick={()=>imageInput.current.click()}><LuImage className='w-[28px] h-[28px] text-[#4a5568] hover:text-[#2d3748] cursor-pointer'/></div>
  {(input || frontendFileUrl) &&  <button className='w-[60px] h-[40px] rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex items-center justify-center cursor-pointer'><IoMdSend className='w-[25px] h-[25px] text-[#2d3748]'/></button>}
 
</form>
</div>


    </div>
  )
}

export default MessageArea
