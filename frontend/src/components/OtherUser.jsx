import React from 'react'
import { useSelector } from 'react-redux'
import dp from "../assets/dp.webp"
import { useNavigate } from 'react-router-dom'
import FollowButton from './FollowButton'
function OtherUser({user}) {
    const {userData}=useSelector(state=>state.user)
    const navigate=useNavigate()
  return (
    <div className='w-full flex items-center justify-between p-[10px] xl:p-[15px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-2xl mb-[15px] transition-all hover:shadow-[8px_8px_16px_#a3b1c6,-8px_-8px_16px_#ffffff]' >
       <div className='flex items-center gap-[10px] min-w-0'>
      <div className='w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] p-[3px] bg-[#e0e5ec] shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] rounded-full cursor-pointer overflow-hidden flex-shrink-0' onClick={()=>navigate(`/profile/${user.userName}`)}>
          <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full'/>
      </div>
      <div className='flex flex-col min-w-0'>
          <div className='text-[14px] xl:text-[16px] text-[#2d3748] font-bold cursor-pointer hover:underline truncate' onClick={()=>navigate(`/profile/${user.userName}`)}>{user.userName}</div>
          <div className='text-[11px] xl:text-[13px] text-[#718096] font-medium truncate'>{user.name}</div>
      </div>
      </div>
      
      <FollowButton tailwind={'px-[10px] py-[4px] xl:px-[15px] xl:py-[6px] text-[11px] xl:text-[13px] font-bold bg-[#e0e5ec] text-[#2d3748] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-xl transition-all flex-shrink-0 ml-2'} targetUserId={user._id}/>
     
    </div>
  )
}

export default OtherUser
