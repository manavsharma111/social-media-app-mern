import React, { useEffect, useState, useRef } from 'react'
import dp from "../assets/dp.webp"
import VideoPlayer from './VideoPlayer'
import { GoHeart } from "react-icons/go";
import { useDispatch, useSelector } from 'react-redux';
import { GoHeartFill } from "react-icons/go";
import { MdOutlineComment } from "react-icons/md";
import { MdOutlineBookmarkBorder } from "react-icons/md";
import { GoBookmarkFill } from "react-icons/go";
import { IoSendSharp } from "react-icons/io5";
import axios from 'axios';
import { serverUrl } from '../App';
import { setPostData } from '../redux/postSlice';
import { setUserData } from '../redux/userSlice';
import FollowButton from './FollowButton';
import { useNavigate } from 'react-router-dom';
import { MdOutlineMoreVert, MdOutlineEmojiEmotions } from "react-icons/md";
import EmojiPicker from 'emoji-picker-react';
import { FiVolume2, FiVolumeX } from "react-icons/fi";

function Post({ post, isModal }) {
  const { userData } = useSelector(state => state.user)
  const { postData } = useSelector(state => state.post)
  const { socket } = useSelector(state => state.socket)
  const [showComment, setShowComment] = useState(false)
  const [message,setMessage]=useState("")
  const [replyingTo, setReplyingTo] = useState(null)
  const [replyMessage, setReplyMessage] = useState("")
  const [showDeleteMenu, setShowDeleteMenu] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editCaption, setEditCaption] = useState(post.caption || "")
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMute, setIsMute] = useState(false)
  const audioRef = useRef()
  const postRef = useRef()
  const navigate=useNavigate()
  const dispatch=useDispatch()

  const handleLike=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/post/like/${post._id}`,{withCredentials:true})
      const updatedPost=result.data

      const updatedPosts=postData.map(p=>p._id==post._id?updatedPost:p)
      dispatch(setPostData(updatedPosts))
    } catch (error) {
      console.log(error)
    }
  }

  const handleDelete = async () => {
    try {
      await axios.delete(`${serverUrl}/api/post/delete/${post._id}`, { withCredentials: true })
      dispatch(setPostData(postData.filter(p => p._id !== post._id)))
    } catch (error) {
      console.log(error)
    }
  }

  const handleEdit = async () => {
    try {
      const result = await axios.put(`${serverUrl}/api/post/edit/${post._id}`, { caption: editCaption }, { withCredentials: true })
      const updatedPost = result.data
      const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
      setIsEditing(false)
    } catch (error) {
      console.log(error)
    }
  }

 const handleComment=async ()=>{
    try {
      const result=await axios.post(`${serverUrl}/api/post/comment/${post._id}`,{message},{withCredentials:true})
      const updatedPost=result.data

      const updatedPosts=postData.map(p=>p._id==post._id?updatedPost:p)
      dispatch(setPostData(updatedPosts))
      setMessage("")
    } catch (error) {
      console.log(error.response)
    }
  }

  const handleLikeComment = async (commentId) => {
    try {
      const result = await axios.get(`${serverUrl}/api/post/comment/like/${post._id}/${commentId}`, { withCredentials: true })
      const updatedPost = result.data
      const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
    } catch (error) { console.log(error) }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      const result = await axios.delete(`${serverUrl}/api/post/comment/delete/${post._id}/${commentId}`, { withCredentials: true })
      const updatedPost = result.data
      const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
    } catch (error) { console.log(error) }
  }

  const handleReplyComment = async (commentId) => {
    if(!replyMessage.trim()) return;
    try {
      const result = await axios.post(`${serverUrl}/api/post/comment/reply/${post._id}/${commentId}`, { message: replyMessage }, { withCredentials: true })
      const updatedPost = result.data
      const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
      setReplyingTo(null)
      setReplyMessage("")
    } catch (error) { console.log(error) }
  }

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      const result = await axios.delete(`${serverUrl}/api/post/comment/reply/delete/${post._id}/${commentId}/${replyId}`, { withCredentials: true })
      const updatedPost = result.data
      const updatedPosts = postData.map(p => p._id == post._id ? updatedPost : p)
      dispatch(setPostData(updatedPosts))
    } catch (error) { console.log(error) }
  }

  const handleSaved=async ()=>{
    try {
      const result=await axios.get(`${serverUrl}/api/post/saved/${post._id}`,{withCredentials:true})
      dispatch(setUserData(result.data))
    } catch (error) {
      console.log(error.response)
    }
  }
  
  useEffect(()=>{
    socket?.on("likedPost",(updatedData)=>{
     const updatedPosts=postData.map(p=>p._id==updatedData.postId?{...p,likes:updatedData.likes}:p)
     dispatch(setPostData(updatedPosts))
    })
socket?.on("commentedPost",(updatedData)=>{
     const updatedPosts=postData.map(p=>p._id==updatedData.postId?{...p,comments:updatedData.comments}:p)
     dispatch(setPostData(updatedPosts))
    })
socket?.on("postEdited",(updatedData)=>{
     const updatedPosts=postData.map(p=>p._id==updatedData.postId?{...p,caption:updatedData.caption}:p)
     dispatch(setPostData(updatedPosts))
    })

    return ()=>{socket?.off("likedPost")
               socket?.off("commentedPost")
               socket?.off("postEdited")}
  },[socket,postData,dispatch])

  useEffect(() => {
    if (post.audio && audioRef.current && postRef.current) {
        const observer = new IntersectionObserver(([entry]) => {
            const audio = audioRef.current
            if (audio) {
                if (entry.isIntersecting) {
                    audio.play().catch(e => console.log(e));
                    setIsPlaying(true)
                } else {
                    audio.pause();
                    setIsPlaying(false)
                }
            }
        }, { threshold: 0.6 })
        
        observer.observe(postRef.current)

        return ()=>{
             if (postRef.current) {
                observer.unobserve(postRef.current)
             }
        }
    }
  }, [post.audio])

  return (
    <div ref={postRef} className={`w-[90%] flex flex-col gap-[10px] bg-[#e0e5ec] items-center rounded-2xl pb-[20px] relative ${isModal ? 'shadow-2xl' : 'shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff]'}`}>
      <div className='w-full h-[80px] flex justify-between items-center px-[15px]'>
        <div className='flex justify-center items-center md:gap-[15px] gap-[10px] cursor-pointer group' onClick={()=>navigate(`/profile/${post.author?.userName}`)}>
          <div className='w-[45px] h-[45px] md:w-[55px] md:h-[55px] p-[2px] bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] rounded-full overflow-hidden flex-shrink-0 group-active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] transition-all'>
            <img src={post.author?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
          </div>
          <div className='flex flex-col'>
             <div className='w-[130px] md:w-[150px] font-bold truncate text-[#2d3748] text-[15px] md:text-[16px] group-hover:underline'>{post.author.userName}</div>
          </div>
        </div>
      <div className='flex items-center gap-[15px]'>
        {userData._id!=post.author._id &&  <FollowButton tailwind={'px-[15px] py-[6px] text-[13px] font-bold bg-[#e0e5ec] text-[#2d3748] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-xl transition-all flex-shrink-0'} targetUserId={post.author._id}/>}
        {userData?._id === post?.author?._id && (
          <div className='relative'>
            <MdOutlineMoreVert className='w-[25px] h-[25px] text-[#4a5568] cursor-pointer' onClick={() => setShowDeleteMenu(!showDeleteMenu)} />
            {showDeleteMenu && (
              <div className='absolute top-[30px] right-0 bg-[#e0e5ec] shadow-md border border-[#c8d0da] rounded-xl flex flex-col p-[10px] z-[10] gap-[5px]'>
                <div className='text-[#4a5568] font-bold cursor-pointer px-[20px] py-[5px] hover:text-[#2d3748] border-b border-[#a3b1c6]' onClick={() => {setShowDeleteMenu(false); setIsEditing(true);}}>Edit</div>
                <div className='text-red-500 font-bold cursor-pointer px-[20px] py-[5px]' onClick={handleDelete}>Delete</div>
              </div>
            )}
          </div>
        )}
      </div>
       
      </div>
      <div className='w-[95%] flex items-center justify-center relative mt-[5px]'>
        {post.mediaType == "image" && <div className='w-full flex items-center justify-center relative'>
          {Array.isArray(post.media) && post.media.length > 0 ? (
            <div className='w-full flex overflow-x-auto snap-x snap-mandatory hide-scrollbar gap-[15px] pb-[10px] px-[5px] pt-[5px]'>
              {post.media.map((url, i) => (
                <div key={i} className='min-w-full aspect-square p-[6px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-3xl snap-center flex items-center justify-center'>
                  <img src={url} alt="" className='w-full h-full rounded-[20px] object-cover' />
                </div>
              ))}
            </div>
          ) : (
            <div className='w-full p-[6px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-3xl flex items-center justify-center'>
               <img src={Array.isArray(post.media) ? post.media[0] : post.media} alt="" className='w-full rounded-[20px] object-cover' />
            </div>
          )}
          {post.audio && (
              <>
                <audio ref={audioRef} autoPlay muted={isMute} loop src={post.audio}></audio>
                <div className='absolute bottom-[20px] right-[20px] z-[50] w-[35px] h-[35px] flex items-center justify-center bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-full cursor-pointer transition-all' onClick={() => setIsMute(!isMute)}>
                   {!isMute ? <FiVolume2 className='w-[16px] h-[16px] text-[#4a5568]'/> : <FiVolumeX className='w-[16px] h-[16px] text-[#4a5568]'/>}
                </div>
              </>
          )}
        </div>}

        {post.mediaType == "video" && <div className='w-full flex flex-col items-center justify-center p-[6px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-3xl'>
          <div className='w-full rounded-[20px] overflow-hidden'>
            <VideoPlayer media={Array.isArray(post.media) ? post.media[0] : post.media} />
          </div>
        </div>}
      </div>

      <div className='w-full h-[60px] flex justify-between items-center px-[20px] mt-[10px]'>
        <div className='flex justify-center items-center gap-[10px] '>
          <div className='flex justify-center items-center gap-[5px]'>
            {!post.likes.includes(userData._id) && <GoHeart className='w-[25px] cursor-pointer h-[25px] text-[#4a5568]' onClick={handleLike}/>}
            {post.likes.includes(userData._id) && <GoHeartFill className='w-[25px] cursor-pointer h-[25px] text-red-600' onClick={handleLike}/>}
            <span className='text-[#4a5568]'>{post.likes.length}</span>
          </div>
          <div className='flex justify-center items-center gap-[5px]' onClick={()=>setShowComment(prev=>!prev)}>
            <MdOutlineComment className='w-[25px] cursor-pointer h-[25px] text-[#4a5568]' />
            <span className='text-[#4a5568]'>{post.comments.length}</span>
          </div>
        </div>
        <div onClick={handleSaved}>
          {!userData.saved.includes(post?._id) && <MdOutlineBookmarkBorder className='w-[25px] cursor-pointer h-[25px] text-[#4a5568]' />}
          {userData.saved.includes(post?._id) && <GoBookmarkFill className='w-[25px] cursor-pointer h-[25px] text-[#4a5568]' />}
        </div>
      </div>
      {post.caption && !isEditing && <div className='w-full px-[20px] gap-[10px] flex justify-start items-center '>
        <h1 className='text-[#2d3748] font-semibold'>{post.author.userName}</h1>
        <div className='text-[#4a5568]'>{post.caption}</div>
      </div>}

      {isEditing && (
         <div className='w-full px-[20px] flex flex-col gap-[10px] items-start relative mt-[10px]'>
            <div className='w-full bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-xl flex items-center px-[10px] relative'>
                {showEmojiPicker && (
                    <div className='absolute bottom-[100%] left-0 z-[600] mb-[10px] shadow-2xl'>
                        <EmojiPicker onEmojiClick={(emojiObject) => setEditCaption(prev => prev + emojiObject.emoji)} theme="light" width={300} height={350}/>
                    </div>
                )}
                <MdOutlineEmojiEmotions className='w-[28px] h-[28px] text-[#4a5568] hover:text-[#2d3748] cursor-pointer' onClick={() => setShowEmojiPicker(prev => !prev)} />
                <input type='text' className='w-full outline-none px-[10px] py-[10px] text-[#4a5568] placeholder-[#a3b1c6] bg-transparent' placeholder='Edit caption' value={editCaption} onChange={(e) => setEditCaption(e.target.value)} autoFocus />
            </div>
            <div className='flex gap-[15px] px-[5px] mt-[5px]'>
               <div className='text-[#2d3748] font-bold cursor-pointer hover:shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] px-[15px] py-[5px] rounded-lg transition-all' onClick={() => { handleEdit(); setShowEmojiPicker(false); }}>Save</div>
               <div className='text-red-500 font-bold cursor-pointer hover:shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] px-[15px] py-[5px] rounded-lg transition-all' onClick={() => { setIsEditing(false); setEditCaption(post.caption); setShowEmojiPicker(false); }}>Cancel</div>
            </div>
         </div>
      )}

      {showComment &&
        <div className='w-full flex flex-col gap-[20px] pb-[10px] mt-[10px] border-t border-[#c8d0da] pt-[20px]'>
          <div className='w-full flex items-center justify-between px-[20px] gap-[15px]'>
            <div className='w-[40px] h-[40px] p-[2px] bg-[#e0e5ec] shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] rounded-full overflow-hidden flex-shrink-0'>
              <img src={userData?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
            </div>
            <div className='flex-1 relative'>
               <input type="text" className='w-full px-[20px] pr-[50px] bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-full text-[#2d3748] placeholder-[#a3b1c6] outline-none h-[45px]' placeholder='Write a comment...' onChange={(e)=>setMessage(e.target.value)} value={message} onKeyDown={(e) => {if(e.key === 'Enter') handleComment()}}/>
               <div className='absolute right-[15px] top-[50%] translate-y-[-50%] cursor-pointer p-[5px] text-[#4a5568] hover:text-[#2d3748] transition-colors' onClick={handleComment}>
                  <IoSendSharp className='w-[20px] h-[20px]'/>
               </div>
            </div>
          </div>

          <div className='w-full max-h-[350px] overflow-y-auto px-[20px] flex flex-col gap-[15px] hide-scrollbar'>
            {post.comments?.map((com,index)=>(
              <div key={index} className='w-full p-[15px] flex flex-col gap-[10px] bg-[#e0e5ec] shadow-[2px_2px_6px_#a3b1c6] rounded-2xl'>
                 <div className='flex items-start gap-[15px]'>
                    <div className='w-[35px] h-[35px] p-[2px] bg-[#e0e5ec] shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] rounded-full cursor-pointer overflow-hidden flex-shrink-0' onClick={() => navigate(`/profile/${com.author.userName}`)}>
                        <img src={com.author.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
                    </div>
                    <div className='flex flex-col flex-1 mt-[2px]'>
                        <div className='font-bold text-[14px] text-[#2d3748] cursor-pointer hover:underline' onClick={() => navigate(`/profile/${com.author.userName}`)}>{com.author.userName}</div>
                        <div className='text-[#4a5568] text-[13px] mt-[2px]'>{com.message}</div>
                        
                        <div className='flex items-center gap-4 mt-2'>
                          <div className='flex items-center gap-1 cursor-pointer text-[#4a5568] hover:text-[#2d3748]' onClick={() => handleLikeComment(com._id)}>
                            {com.likes?.includes(userData._id) ? <GoHeartFill className='w-4 h-4 text-red-600'/> : <GoHeart className='w-4 h-4'/>}
                            <span className='text-xs font-bold'>{com.likes?.length || 0}</span>
                          </div>
                          <div className='text-xs font-bold cursor-pointer text-[#4a5568] hover:text-[#2d3748]' onClick={() => setReplyingTo(replyingTo === com._id ? null : com._id)}>Reply</div>
                          {(com.author._id === userData._id || post.author._id === userData._id) && (
                            <div className='text-xs font-bold cursor-pointer text-red-500 hover:text-red-700' onClick={() => handleDeleteComment(com._id)}>Delete</div>
                          )}
                        </div>

                        {replyingTo === com._id && (
                          <div className='w-full flex items-center gap-2 mt-3 bg-white/40 p-1 rounded-full pl-3'>
                            <input type='text' className='flex-1 bg-transparent text-sm outline-none text-[#2d3748]' placeholder={`Reply to ${com.author.userName}...`} autoFocus value={replyMessage} onChange={e => setReplyMessage(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleReplyComment(com._id)} />
                            <button className='text-xs font-bold text-white bg-[#4a5568] rounded-full px-3 py-1' onClick={() => handleReplyComment(com._id)}>Send</button>
                          </div>
                        )}
                        
                        {/* Replies */}
                        {com.replies?.length > 0 && (
                          <div className='flex flex-col gap-3 mt-3 pl-3 pt-2 border-l-2 border-[#c8d0da]'>
                            {com.replies.map(reply => (
                              <div key={reply._id} className='flex items-start gap-2'>
                                <div className='w-[25px] h-[25px] rounded-full overflow-hidden flex-shrink-0 cursor-pointer p-[1px] bg-[#e0e5ec] shadow-[inset_1px_1px_3px_#a3b1c6,inset_-1px_-1px_3px_#ffffff]' onClick={() => navigate(`/profile/${reply.author.userName}`)}>
                                    <img src={reply.author.profileImage || dp} className='w-full h-full object-cover rounded-full' />
                                </div>
                                <div className='flex flex-col flex-1'>
                                    <div className='font-bold text-[12px] text-[#2d3748] cursor-pointer hover:underline leading-tight' onClick={() => navigate(`/profile/${reply.author.userName}`)}>{reply.author.userName}</div>
                                    <div className='text-[#4a5568] text-[12px] mt-[1px]'>{reply.message}</div>
                                    {(reply.author._id === userData._id || post.author._id === userData._id || com.author._id === userData._id) && (
                                      <div className='text-[10px] font-bold cursor-pointer text-red-500 hover:text-red-700 mt-1' onClick={() => handleDeleteReply(com._id, reply._id)}>Delete</div>
                                    )}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                    </div>
                 </div>
              </div>
            ))}
          </div>
        </div>
      }



    </div>
  )
}

export default Post
