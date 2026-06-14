import React, { useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import OnlineUser from '../components/OnlineUser';
import { setSelectedUser } from '../redux/messageSlice';
import dp from "../assets/dp.webp"

function Messages() {
    const navigate=useNavigate()

    const {userData}=useSelector(state=>state.user)
    const {onlineUsers}=useSelector(state=>state.socket)
    const {prevChatUsers}=useSelector(state=>state.message)
    const dispatch=useDispatch()
    
    // Check if any followed users are online
    const activeFriends = userData.following?.filter(user => onlineUsers?.includes(user._id)) || [];

    const formatTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        const now = new Date();
        const diffInMs = now - date;
        const diffInMins = Math.floor(diffInMs / 60000);
        const diffInHours = Math.floor(diffInMs / 3600000);
        const diffInDays = Math.floor(diffInMs / 86400000);

        if (diffInMins < 1) return "Just now";
        if (diffInMins < 60) return `${diffInMins}m`;
        if (diffInHours < 24) return `${diffInHours}h`;
        if (diffInDays === 1) return "Yesterday";
        if (diffInDays < 7) return `${diffInDays}d`;
        
        return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    };

  return (
    <div className='w-full min-h-[100dvh] flex flex-col bg-[#e0e5ec] p-[20px] pb-[100px] relative origin-center animate-explode'>
       {/* Header */}
       <div className='w-full flex items-center gap-[20px] mb-[30px] pt-[20px]'>
          <div className='w-[40px] h-[40px] flex items-center justify-center rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] cursor-pointer lg:hidden active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] transition-all' onClick={() => navigate(`/`)}>
             <MdOutlineKeyboardBackspace className='text-[#2d3748] w-[20px] h-[20px]' />
          </div>
          <h1 className='text-[#2d3748] text-[24px] font-bold tracking-wide'>Messages</h1>
       </div>

       {/* Active Now Section */}
       {activeFriends.length > 0 && (
         <div className='mb-[30px]'>
           <h2 className='text-[#4a5568] text-[14px] font-semibold mb-[15px] pl-[5px] uppercase tracking-wider'>Active Now</h2>
           <div className='w-full flex gap-[20px] overflow-x-auto hide-scrollbar py-[10px] px-[10px]'>
             {activeFriends.map((user)=>(
               <OnlineUser user={user} key={user._id} />
             ))}
           </div>
         </div>
       )}

       {/* Chat List */}
       <div className='w-full flex flex-col gap-[20px]'>
         {prevChatUsers?.length > 0 && (
           <h2 className='text-[#4a5568] text-[14px] font-semibold mb-[5px] pl-[5px] uppercase tracking-wider'>Recent Conversations</h2>
         )}
         {prevChatUsers?.map((user)=>(
            <div key={user._id} className='w-full flex items-center gap-[15px] p-[15px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-2xl cursor-pointer hover:shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] transition-all duration-300' onClick={()=>{
              dispatch(setSelectedUser(user))
              navigate("/messageArea")
            }}>
               {/* Avatar */}
               <div className='relative'>
                 <div className='w-[55px] h-[55px] p-[3px] bg-[#e0e5ec] shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] rounded-full overflow-hidden flex-shrink-0'>
                   <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full'/>
                 </div>
                 {onlineUsers?.includes(user._id) && (
                   <div className='w-[14px] h-[14px] bg-green-500 rounded-full border-[3px] border-[#e0e5ec] absolute bottom-[2px] right-[2px] shadow-[0_0_8px_rgba(34,197,94,0.6)]'></div>
                 )}
               </div>

               {/* Name and Message Preview */}
               <div className='flex flex-col flex-1 min-w-0'>
                 <div className='w-full flex justify-between items-center'>
                     <div className='text-[#2d3748] text-[16px] font-bold truncate'>{user.userName}</div>
                     {user.lastMessage && (
                         <div className={`text-[12px] whitespace-nowrap ml-[10px] ${user.unreadCount > 0 ? 'text-red-500 font-bold' : 'text-[#718096]'}`}>
                             {formatTime(user.lastMessage.createdAt)}
                         </div>
                     )}
                 </div>
                 
                 <div className='w-full flex justify-between items-center mt-[2px]'>
                     <div className={`text-[13px] truncate pr-[10px] ${user.unreadCount > 0 ? 'text-[#2d3748] font-bold' : 'text-[#718096]'}`}>
                        {user.lastMessage ? (
                            user.lastMessage.message === "🚫 This message was deleted" ? "🚫 This message was deleted" :
                            user.lastMessage.message || "📷 Photo"
                        ) : (
                            onlineUsers?.includes(user._id) ? 'Active Now' : 'Offline'
                        )}
                     </div>
                     {user.unreadCount > 0 && (
                         <div className='w-[20px] h-[20px] rounded-full bg-red-500 text-white text-[11px] font-bold flex items-center justify-center flex-shrink-0 shadow-[0_2px_5px_rgba(239,68,68,0.5)]'>
                             {user.unreadCount}
                         </div>
                     )}
                 </div>
               </div>
            </div>
         ))}
       </div>          
    </div>
  )
}

export default Messages
