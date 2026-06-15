import React, { useEffect, useRef } from 'react'
import { useSelector } from 'react-redux'

import axios from 'axios';
import { serverUrl } from '../App';
import { setMessages } from '../redux/messageSlice';
import { useDispatch } from 'react-redux';
import { MdOutlineEmojiEmotions, MdOutlineMoreVert, MdCall, MdVideocam } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';

function SenderMessage({message}) {
    const {userData}=useSelector(state=>state.user)
    const {messages}=useSelector(state=>state.message)
    const [showMenu, setShowMenu] = React.useState(false)
    const [showReactions, setShowReactions] = React.useState(false)
    const dispatch = useDispatch()
    const scroll = useRef()
    useEffect(()=>{
scroll.current.scrollIntoView({behavior:"smooth"})
    },[message.message,message.image])

    const timeString = new Date(message.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const handleDelete = async () => {
      try {
        const res = await axios.delete(`${serverUrl}/api/message/delete/${message._id}`, { withCredentials: true });
        dispatch(setMessages(messages.map(m => m._id === message._id ? res.data : m)));
      } catch (err) { console.log(err); }
    };

    const handleDeleteForMe = async () => {
      try {
        await axios.delete(`${serverUrl}/api/message/deleteForMe/${message._id}`, { withCredentials: true });
        dispatch(setMessages(messages.filter(m => m._id !== message._id)));
      } catch (err) { console.log(err); }
    };

    const handleEdit = async () => {
      const newText = prompt("Edit your message:", message.message || "");
      if(newText && newText !== message.message) {
        try {
          const res = await axios.put(`${serverUrl}/api/message/edit/${message._id}`, { message: newText }, { withCredentials: true });
          dispatch(setMessages(messages.map(m => m._id === message._id ? res.data : m)));
        } catch (err) { console.log(err); }
      }
      setShowMenu(false);
    };

    const handleReact = async (emojiObject) => {
      try {
        const res = await axios.post(`${serverUrl}/api/message/react/${message._id}`, { reaction: emojiObject.emoji }, { withCredentials: true });
        dispatch(setMessages(messages.map(m => m._id === message._id ? res.data : m)));
      } catch (err) { console.log(err); }
      setShowReactions(false);
    };

    const [showActions, setShowActions] = React.useState(false);

  return (
    <div ref={scroll} className='w-full flex justify-end mb-[20px] group' onMouseLeave={() => { setShowMenu(false); setShowReactions(false); setShowActions(false); }}>
      <div className='flex items-end justify-end gap-[10px] max-w-full'>
        
    {/* Action Menus */}
    {!message.isDeletedForEveryone && (
      <div className={`flex items-center gap-2 mr-[10px] transition-all duration-300 ${showActions ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none lg:pointer-events-auto lg:group-hover:opacity-100 lg:group-hover:pointer-events-auto'}`}>
        {/* Reaction Menu */}
        <div className='relative'>
          <MdOutlineEmojiEmotions className='w-[20px] h-[20px] text-[#4a5568] cursor-pointer' onClick={(e) => {e.stopPropagation(); setShowReactions(!showReactions); setShowMenu(false);}} />
          {showReactions && (
            <div className='absolute bottom-[30px] right-0 z-[50] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-2xl' onClick={(e) => e.stopPropagation()}>
              <EmojiPicker onEmojiClick={handleReact} theme="light" width={300} height={350}/>
            </div>
          )}
        </div>

        {/* Menu Icon */}
        <div className='relative'>
          <MdOutlineMoreVert className='w-[20px] h-[20px] text-[#4a5568] cursor-pointer' onClick={(e) => {e.stopPropagation(); setShowMenu(!showMenu); setShowReactions(false);}} />
          {showMenu && (
            <div className='absolute bottom-full mb-2 right-0 bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-xl p-[10px] z-[50] flex flex-col gap-2 min-w-[160px] text-right' onClick={(e) => e.stopPropagation()}>
              <div className='text-[#4a5568] font-bold cursor-pointer px-[10px] py-[5px] text-[14px] whitespace-nowrap hover:bg-white/50 rounded-lg transition-colors' onClick={handleEdit}>Edit</div>
              <div className='text-[#4a5568] font-bold cursor-pointer px-[10px] py-[5px] text-[14px] whitespace-nowrap hover:bg-white/50 rounded-lg transition-colors' onClick={handleDeleteForMe}>Delete for Me</div>
              <div className='text-red-500 font-bold cursor-pointer px-[10px] py-[5px] text-[14px] whitespace-nowrap hover:bg-white/50 rounded-lg transition-colors' onClick={handleDelete}>Delete for Everyone</div>
            </div>
          )}
        </div>
      </div>
    )}

    <div className={`max-w-[85%] md:max-w-[70%] bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-2xl relative cursor-pointer ${(!message.message && message.image) ? 'p-[10px]' : 'px-[20px] py-[15px]'}`} onClick={(e) => {e.stopPropagation(); setShowActions(!showActions);}}>
        {message?.image && (
          <div className={`${message.message ? 'mb-2' : ''} flex justify-center items-center`}>
            {message?.fileType?.includes('video') ? (
              <video src={message.image} controls className='w-full max-w-[280px] rounded-xl overflow-hidden' />
            ) : message?.fileType?.includes('audio') ? (
              <audio src={message.image} controls className='min-w-[250px] w-full max-w-[280px]' />
            ) : message?.fileType?.includes('application') || message?.fileType?.includes('text') ? (
              <a href={message.image} target='_blank' rel='noreferrer' className='flex items-center gap-2 p-3 bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-xl text-[#2d3748] font-bold decoration-none'>
                📎 Download File
              </a>
            ) : (
              <img src={message.image} alt="attachment" className='w-full max-w-[280px] rounded-xl object-contain overflow-hidden' />
            )}
          </div>
        )}
        {message?.message && message.message.startsWith('CALL_HISTORY||') ? (() => {
            const parts = message.message.split('||');
            const type = parts[1];
            const duration = parts[2];
            const isMissed = duration === '0' || duration === '00:00';
            return (
                <div className={`text-[15px] font-bold flex flex-col items-end gap-1 ${isMissed ? 'text-red-500' : 'text-blue-500'}`}>
                    <div className='flex items-center gap-2'>
                        {type === 'video' ? <MdVideocam className='w-[20px] h-[20px]' /> : <MdCall className='w-[20px] h-[20px]' />}
                        <span>{isMissed ? 'Missed Call' : 'Dialed Call'}</span>
                    </div>
                    {!isMissed && <span className='text-[12px] font-normal text-[#718096]'>{duration}</span>}
                </div>
            );
        })() : message?.message && (
          <div className={`text-[18px] break-words ${message.isDeletedForEveryone ? 'text-[#718096] italic' : 'text-[#2d3748]'}`}>
            {message.message}
            {message.edited && !message.isDeletedForEveryone && <span className='text-[10px] text-[#a3b1c6] ml-2'>(edited)</span>}
          </div>
        )}
        
        <div className="text-[10px] text-[#a3b1c6] font-semibold self-end mt-1 text-right w-full">{timeString}</div>

        {message?.reaction && (
          <div 
            className='absolute bottom-[-15px] left-[10px] bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] rounded-full px-[8px] py-[2px] text-[16px] cursor-pointer hover:scale-110 transition-transform'
            onClick={() => handleReact({ emoji: message.reaction })}
            title="Click to remove"
          >
            {message.reaction}
          </div>
        )}
    </div>

        <div className='w-[30px] h-[30px] flex-shrink-0 rounded-full shadow-[2px_2px_5px_#a3b1c6,-2px_-2px_5px_#ffffff] cursor-pointer overflow-hidden'>
            <img src={userData.profileImage} alt="" className='w-full h-full object-cover'/>
        </div>

    </div>
</div>
  )
}

export default SenderMessage
