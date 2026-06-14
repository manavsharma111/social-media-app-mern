import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import { FiPlusCircle } from "react-icons/fi";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
function StoryDp({ProfileImage,userName,story}) {
const navigate=useNavigate()
const{ userData}=useSelector(state=>state.user)
const{ storyData,storyList}=useSelector(state=>state.story)
const [viewed,setViewed]=useState(false)
useEffect(()=>{
  if(story?.viewers?.some((viewer)=>
  viewer?._id?.toString()===userData._id.toString() || viewer?.toString()==userData._id.toString()
)){
  setViewed(true)
}else{
  setViewed(false)
}


},[story,userData,storyData,storyList])
const handleViewers=async ()=>{
  try {
    const result=await axios.get(`${serverUrl}/api/story/view/${story._id}`,{withCredentials:true})
    
  } catch (error) {
    console.log(error)
  }
}


const handleClick=()=>{
  if(!story && userName=="Your Story"){
    navigate("/upload")
  }else if(story && userName=="Your Story"){
      handleViewers()
    navigate(`/story/${userData?.userName}`)
 
  }else {
     handleViewers()
navigate(`/story/${userName}`)
  }
}
  return (
    <div className='flex flex-col w-[75px] cursor-pointer group flex-shrink-0' onClick={handleClick}>
      <div className='w-[70px] h-[70px] mx-auto relative rounded-full p-[3px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] group-active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] transition-all duration-300'>
          <div className={`w-full h-full rounded-full p-[2.5px] ${!story ? 'bg-transparent' : !viewed ? 'bg-gradient-to-tr from-blue-500 to-purple-500' : 'bg-[#a3b1c6]'}`}>
              <div className='w-full h-full rounded-full overflow-hidden border-2 border-[#e0e5ec] bg-[#e0e5ec]'>
                 <img src={ProfileImage || dp} alt="" className='w-full h-full object-cover'/>
              </div>
          </div>
          {!story && userName === "Your Story" && (
             <div className='absolute bottom-0 right-0 w-[22px] h-[22px] bg-blue-500 rounded-full border-[2.5px] border-[#e0e5ec] flex items-center justify-center shadow-[0_0_5px_rgba(59,130,246,0.5)]'>
                <FiPlusCircle className='text-white w-[14px] h-[14px]' />
             </div>
          )}
      </div>
      <div className='text-[12px] text-center mt-[8px] truncate w-full text-[#4a5568] font-medium'>{userName}</div>
    </div>
  )
}

export default StoryDp