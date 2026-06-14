import React, { useEffect, useState } from 'react'
import dp from "../assets/dp.webp"
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import VideoPlayer from './VideoPlayer';
import { FaEye } from "react-icons/fa6";
function StoryCard({storyData}) {
  const {userData}=useSelector(state=>state.user)
  const [showViewers,setShowViewers]=useState(false)
    const navigate=useNavigate({storyData})
    const [progress,setProgress]=useState(0)

    useEffect(()=>{
     const interval=setInterval(()=>{
       setProgress(prev=>{
        if(prev>=100){
           clearInterval(interval)
           navigate("/")
          return 100
        }  
      return prev+1})
     },150)

     return ()=>clearInterval(interval)
    },[navigate])
  return (
    <div className='w-full max-w-[500px] h-[100vh] bg-white/40 backdrop-blur-md border border-white/50 shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] pt-[10px] relative flex flex-col justify-center'>
      
      <div className='flex items-center gap-[10px] absolute top-[30px] px-[10px] z-[100]'>
         <MdOutlineKeyboardBackspace className='text-[#2d3748] cursor-pointer w-[25px] h-[25px] hover:text-black transition-all' onClick={() => navigate(`/`)} />
        <div className='flex items-center gap-[10px] cursor-pointer hover:opacity-80 transition-all' onClick={() => navigate(`/profile/${storyData?.author?.userName}`)}>
          <div className='w-[30px] h-[30px] md:w-[40px] md:h-[40px] shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] rounded-full overflow-hidden p-[2px]' >
             <img src={storyData?.author?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
          </div>
          <div className='w-[120px] font-semibold truncate text-[#2d3748] hover:underline'>{storyData?.author?.userName}</div>
        </div>
      </div>

<div className='absolute top-[10px] left-0 w-full h-[5px] bg-[#a3b1c6]/30'>
<div className='h-full bg-white transition-[width] duration-150 ease-linear' style={{width:`${progress}%`}}>
</div>
            </div>
      {!showViewers && <><div className='w-[full] h-[90vh]  flex  items-center justify-center '>
        {storyData?.mediaType == "image" && <div className='w-[90%]    flex  items-center justify-center   '>
          <img src={storyData?.media} alt="" className='w-[80%] rounded-2xl  object-cover' />
          {storyData?.audio && <audio autoPlay src={storyData?.audio}></audio>}
        </div>}

        {storyData?.mediaType == "video" && <div className='w-[80%]    flex flex-col items-center justify-center   '>
          <VideoPlayer media={storyData?.media} />
        </div>}
      </div>


{storyData?.author?.userName==userData?.userName &&  <div className='absolute w-full flex items-center gap-[10px] text-[#2d3748] h-[70px] bottom-0 p-2 left-0 cursor-pointer ' onClick={()=>setShowViewers(true)}>
<div className='text-[#2d3748] flex items-center gap-[5px]'><FaEye />{storyData.viewers.length}</div>
 <div className='flex relative'>

                             {storyData?.viewers?.slice(0, 3).map((viewer, index) => (
                               

                                <div className={`w-[30px] h-[30px]  shadow-[2px_2px_5px_#a3b1c6] rounded-full cursor-pointer overflow-hidden ${index>0?`absolute left-[${index*10}px]`:""}`}>
                                    <img src={viewer?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}

                        </div>

</div>  }</>}

{showViewers && 
<>
<div className='w-full h-[30%]  flex  items-center justify-center mt-[100px] cursor-pointer py-[30px] overflow-hidden ' onClick={()=>setShowViewers(false)}>
        {storyData?.mediaType == "image" && <div className='h-full   flex  items-center justify-center   '>
          <img src={storyData?.media} alt="" className='h-full rounded-2xl  object-cover' />
          {storyData?.audio && <audio autoPlay src={storyData?.audio}></audio>}
        </div>}

        {storyData?.mediaType == "video" && <div className='h-full  flex flex-col items-center justify-center   '>
          <VideoPlayer media={storyData?.media} />
        </div>}
      </div>

      <div className='w-full h-[70%] border-t border-t-white/40 p-[20px]'>
    <div className='text-[#2d3748] flex items-center gap-[10px]'><FaEye /><span>{storyData?.viewers?.length}</span><span>Viewers</span></div>
     <div className='w-full max-h-full flex flex-col gap-[10px] overflow-auto pt-[20px]'>
{storyData?.viewers?.map((viewer,index)=>(
<div key={index} className='w-full flex items-center gap-[20px] cursor-pointer hover:bg-black/5 p-[10px] rounded-xl transition-all' onClick={() => navigate(`/profile/${viewer?.userName}`)}>
   <div className='w-[40px] h-[40px] md:w-[50px] md:h-[50px] shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] rounded-full overflow-hidden p-[2px]' >
      <img src={viewer?.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full' />
   </div>
   <div className='flex-1 font-semibold truncate text-[#2d3748] hover:underline'>{viewer?.userName}</div>
</div>
))}
  </div>
      </div>
      
  </>}

 
         

    </div>
  )
}

export default StoryCard
