import React from 'react'
import { useState } from 'react'
import { useEffect } from 'react'
import { useRef } from 'react'
import { FiVolume2 } from "react-icons/fi";
import { FiVolumeX } from "react-icons/fi";
import { FaPlay } from "react-icons/fa";
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import dp from "../assets/dp.webp"
import FollowButton from './FollowButton';
import { GoHeart } from "react-icons/go";
import { GoHeartFill } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { MdOutlineComment } from "react-icons/md";
import { setLoopData } from '../redux/loopSlice';
import axios from 'axios';
import { serverUrl } from '../App';
import { IoSendSharp } from "react-icons/io5";
function LoopCard({ loop, isModal }) {
    const videoRef = useRef()
    const audioRef = useRef()
    const [lastTap, setLastTap] = useState(0)
const [isPlaying,setIsPlaying]=useState(true)
const [isMute,setIsMute]=useState(false)
const navigate = useNavigate()
const progressRef = useRef()
const animationRef = useRef()
const [playbackRate, setPlaybackRate] = useState(1)
const {userData}=useSelector(state=>state.user)
const {socket}=useSelector(state=>state.socket)
const {loopData}=useSelector(state=>state.loop)
const [showHeart,setShowHeart]=useState(false)
const [showComment,setShowComment]=useState(false)
const [showEmojiPicker,setShowEmojiPicker]=useState(false)
const [message,setMessage]=useState("")
const dispatch=useDispatch()
const commentRef=useRef()
const updateProgress = () => {
    const mediaElement = loop.mediaType === "image" ? audioRef.current : videoRef.current
    if(mediaElement && progressRef.current){
        const percent=(mediaElement.currentTime / mediaElement.duration)*100
        progressRef.current.style.width = `${percent || 0}%`
    }
    if(isPlaying){
        animationRef.current = requestAnimationFrame(updateProgress)
    }
}

useEffect(() => {
    if(isPlaying){
        animationRef.current = requestAnimationFrame(updateProgress)
    } else {
        cancelAnimationFrame(animationRef.current)
    }
    return () => cancelAnimationFrame(animationRef.current)
}, [isPlaying])

useEffect(() => {
    const mediaElement = loop.mediaType === "image" ? audioRef.current : videoRef.current
    if (mediaElement) {
        mediaElement.playbackRate = playbackRate
    }
}, [playbackRate, isPlaying, loop.mediaType])

const handleSeek = (e) => {
    e.stopPropagation()
    const progressBar = e.currentTarget
    const clickPosition = e.clientX - progressBar.getBoundingClientRect().left
    const percent = clickPosition / progressBar.offsetWidth
    const mediaElement = loop.mediaType === "image" ? audioRef.current : videoRef.current
    if (mediaElement && mediaElement.duration) {
        mediaElement.currentTime = percent * mediaElement.duration
    }
}
const handleLikeOnDoubleClick=()=>{
    setShowHeart(true)
    setTimeout(()=>setShowHeart(false),6000)
    {!loop.likes?.includes(userData._id)?handleLike():null }
}

const handleClick=()=>{
    if(showComment) {
        setShowComment(false);
        return;
    }
    if(isPlaying){
        if(videoRef.current) videoRef.current.pause()
        if(audioRef.current) audioRef.current.pause()
        setIsPlaying(false)
    }else{
        if(videoRef.current) videoRef.current.play()
        if(audioRef.current) audioRef.current.play()
        setIsPlaying(true)
    }
}

const handleTap = (e) => {
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
        setLastTap(0);
        handleLikeOnDoubleClick();
    } else {
        setLastTap(now);
        // Delay single click to wait for double click
        setTimeout(() => {
            if (Date.now() - now >= DOUBLE_PRESS_DELAY - 50) {
                handleClick();
            }
        }, DOUBLE_PRESS_DELAY);
    }
}

const handleLike=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/loop/like/${loop._id}`,{withCredentials:true})
      const updatedLoop=result.data

      const updatedLoops=loopData.map(p=>p._id==loop._id?updatedLoop:p)
      dispatch(setLoopData(updatedLoops))
    } catch (error) {
      console.log(error)
    }
  }

  const handleEmojiClick = (emojiObject) => {
    setMessage(prev => prev + emojiObject.emoji);
  };

  const handleComment=async ()=>{
    
    try {
      const result=await axios.post(`${serverUrl}/api/loop/comment/${loop._id}`,{message},{withCredentials:true})
      const updatedLoop=result.data

      const updatedLoops=loopData.map(p=>p._id==loop._id?updatedLoop:p)
      dispatch(setLoopData(updatedLoops))
      setMessage("")
    } catch (error) {
      console.log(error)
    }
  }
 

useEffect(()=>{
const handleClickOutside=(event)=>{
if(commentRef.current && !commentRef.current.contains(event.target) ){
    setShowComment(false)
}
}

if(showComment){
    document.addEventListener("mousedown",handleClickOutside)
}else{
    document.removeEventListener("mousedown",handleClickOutside)
}

},[showComment])




    useEffect(() => {
        const observer = new IntersectionObserver(([entry]) => {
            const mediaElement = loop.mediaType === "image" ? audioRef.current : videoRef.current
            if (entry.isIntersecting) {
                if(mediaElement) mediaElement.play()
                setIsPlaying(true)
            } else {
                if(mediaElement) mediaElement.pause()
                setIsPlaying(false)
            }
        }, { threshold: 0.6 })
        
        const targetElement = loop.mediaType === "image" ? (audioRef.current || videoRef.current) : videoRef.current
        
        // Timeout to allow refs to attach if image mediaType doesn't have audio
        setTimeout(() => {
            const actualTarget = loop.mediaType === "image" && audioRef.current ? audioRef.current : videoRef.current;
            if (actualTarget) {
                observer.observe(actualTarget)
            }
        }, 100);

        return ()=>{
             const actualTarget = loop.mediaType === "image" && audioRef.current ? audioRef.current : videoRef.current;
             if (actualTarget) {
                 observer.unobserve(actualTarget)
             }
        }

    }, [loop.mediaType])


    useEffect(()=>{
        socket?.on("likedLoop",(updatedData)=>{
         const updatedLoops=loopData.map(p=>p._id==updatedData.loopId?{...p,likes:updatedData.likes}:p)
         dispatch(setLoopData(updatedLoops))
        })
    socket?.on("commentedLoop",(updatedData)=>{
         const updatedLoops=loopData.map(p=>p._id==updatedData.loopId?{...p,comments:updatedData.comments}:p)
         dispatch(setLoopData(updatedLoops))
        })
    
        return ()=>{socket?.off("likedLoop")
                   socket?.off("commentedLoop")}
      },[socket,loopData,dispatch])
    return (
        <div className={`w-full lg:w-[420px] h-[100vh] lg:h-[90vh] lg:rounded-[40px] flex items-center justify-center relative overflow-hidden bg-black ${isModal ? 'shadow-2xl' : 'lg:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff]'}`}>

{showHeart && <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 heart-animation  z-50'>
   <GoHeartFill className='w-[100px]  h-[100px] text-white drop-shadow-2xl' /> 
</div>}

<div ref={commentRef} className={`absolute z-[200] bottom-0 w-full h-[500px] p-[10px] rounded-t-[30px] bg-[#e0e5ec] transform transition-transform duration-500 ease-in-out left-0 ${showComment?"translate-y-0":"translate-y-[100%] "}`}>
<h1 className='text-[#2d3748] text-[20px] text-center font-semibold'>Comments</h1>

<div className='w-full h-[350px] overflow-y-auto flex flex-col gap-[20px]'>

    {loop.comments.length==0 && <div className='text-center text-[#2d3748] text-[20px] font-semibold mt-[50px]'>No Comments Yet</div>}

{loop.comments?.map((com,index)=>(
<div className='w-full flex flex-col gap-[5px] border-b border-[#a3b1c6]/40 justify-center pb-[10px] mt-[10px]'>
<div className='flex justify-start items-center md:gap-[20px] gap-[10px] cursor-pointer' onClick={() => navigate(`/profile/${com.author?.userName}`)}>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-full overflow-hidden p-[2px]'>
            <img src={com.author?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
          </div>
          <div className='flex-1 font-semibold text-[#2d3748] hover:underline truncate'>{com.author?.userName}</div>
        </div>
        <div className='text-[#4a5568] pl-[60px]'>{com.message}</div>
</div>
))}
</div>
 <div className='w-full absolute left-0 bottom-0 h-[80px] flex items-center justify-between px-[20px] py-[20px] bg-[#e0e5ec] z-[210] shadow-[0px_-6px_12px_-6px_#a3b1c6]'>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-full cursor-pointer overflow-hidden p-[2px]'>
            <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
          </div>
          
          <div className='relative w-[80%] flex items-center'>
            <input type="text" className={`px-[20px] bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-xl w-full text-[#4a5568] placeholder-[#a3b1c6] outline-none h-[40px] ${message?'pr-[70px]':'pr-[40px]'}`} placeholder='Write comment...' onChange={(e)=>setMessage(e.target.value)} value={message}/>
            <MdOutlineEmojiEmotions className={`absolute ${message?'right-[45px]':'right-[15px]'} text-[#a3b1c6] w-[20px] h-[20px] cursor-pointer hover:text-[#4a5568] transition-all`} onClick={() => setShowEmojiPicker(prev => !prev)} />
            
            {message &&  <button className='absolute right-[15px] cursor-pointer' onClick={handleComment}><IoSendSharp className='w-[20px] h-[20px] text-[#2d3748]'/></button>}

            {showEmojiPicker && (
                <div className='absolute bottom-[50px] right-0 z-[300] shadow-2xl'>
                    <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" width={300} height={400}/>
                </div>
            )}
          </div>
         
          </div>
</div>



            {loop.mediaType === "image" ? (
                <>
                    <img src={loop.media} className='w-full h-full object-cover cursor-pointer' onClick={handleTap} />
                    {loop.audio && <audio ref={audioRef} autoPlay muted={isMute} loop src={loop.audio} />}
                </>
            ) : (
                <video ref={videoRef} autoPlay muted={isMute} loop src={loop?.media} className='w-full max-h-full cursor-pointer' onClick={handleTap} />
            )}
            
            {!isPlaying && (
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 pointer-events-none'>
                    <FaPlay className='w-[60px] h-[60px] text-white/70 drop-shadow-lg' />
                </div>
            )}
            <div className='absolute top-[20px] z-[100] right-[20px] cursor-pointer' onClick={(e)=>{e.stopPropagation(); setIsMute(prev=>!prev);}}>
               {!isMute?<FiVolume2 className='w-[20px] h-[20px] text-white font-semibold'/>:<FiVolumeX className='w-[20px] h-[20px] text-white font-semibold'/>}
            </div>
            
            <div className='absolute top-[60px] z-[100] right-[20px] bg-black/40 text-white rounded-full px-[8px] py-[4px] text-xs cursor-pointer font-bold border border-white/30' onClick={(e) => {
                e.stopPropagation()
                setPlaybackRate(prev => {
                    if (prev === 1) return 1.25;
                    if (prev === 1.25) return 1.5;
                    if (prev === 1.5) return 1.75;
                    if (prev === 1.75) return 2;
                    return 1;
                })
            }}>
                {playbackRate}x
            </div>

            <div className='absolute bottom-0 left-0 w-full h-[15px] cursor-pointer z-[100] group' onClick={handleSeek}>
                <div className='absolute bottom-0 left-0 w-full h-[4px] bg-white/30 group-hover:h-[6px] transition-all'>
                    <div ref={progressRef} className='h-full bg-white w-0 relative'>
                        <div className='absolute right-0 top-1/2 -translate-y-1/2 w-[10px] h-[10px] bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity'></div>
                    </div>
                </div>
            </div>

            <div className='w-full absolute bottom-[20px] p-[15px] flex flex-col gap-[10px] bg-black/30 backdrop-blur-md rounded-2xl mx-[15px] w-[calc(100%-30px)]  shadow-lg'>
<div className='flex items-center gap-[5px] cursor-pointer' onClick={() => navigate(`/profile/${loop.author?.userName}`)}>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] rounded-full overflow-hidden border border-white/50' >
            <img src={loop.author?.profileImage || dp} alt="" className='w-full object-cover' />
          </div>
          <div className='w-[120px] font-semibold truncate text-white drop-shadow-md '>{loop.author.userName}</div>
       
        {loop.author?._id !== userData?._id && (
            <div onClick={(e) => e.stopPropagation()}>
                <FollowButton targetUserId={loop.author?._id} tailwind={"px-[10px] py-[5px] text-white border-2 text-[14px] rounded-2xl border-white"}/>
            </div>
        )}
         </div>
         <div className='text-white px-[10px] drop-shadow-md'>
            {loop.caption}
         </div>

         <div className='absolute right-[15px] flex flex-col gap-[20px] text-white bottom-[100px] justify-center p-[10px] bg-black/30 backdrop-blur-md rounded-full border border-white/20 shadow-lg'>
<div className='flex flex-col items-center cursor-pointer'>
    <div onClick={handleLike}>
        {!loop.likes.includes(userData._id) && <GoHeart className='w-[25px] cursor-pointer h-[25px]'/>}
                   {loop.likes.includes(userData._id) && <GoHeartFill className='w-[25px] cursor-pointer h-[25px] text-red-600' />} 
    </div>
    <div >{loop.likes.length}</div>
</div>
<div className='flex flex-col items-center cursor-pointer' onClick={()=>setShowComment(true)}>
    <div><MdOutlineComment className='w-[25px] cursor-pointer h-[25px]'/></div>
    <div>{loop.comments.length}</div>
</div>

         </div>
            </div>
        </div>
    )
}

export default LoopCard