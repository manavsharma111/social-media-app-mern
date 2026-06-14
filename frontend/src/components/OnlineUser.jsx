import React from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setSelectedUser } from '../redux/messageSlice'
import dp from "../assets/dp.webp"

function OnlineUser({user}) {
    const navigate=useNavigate()
    const dispatch=useDispatch()
  return (
    <div className='flex flex-col items-center gap-[8px] cursor-pointer group' onClick={()=>{
        dispatch(setSelectedUser(user))
        navigate(`/messageArea`)
    }}>
      <div className='relative'>
        <div className='w-[60px] h-[60px] p-[3px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-full group-active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] transition-all duration-300'>
           <div className='w-full h-full rounded-full overflow-hidden'>
               <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover'/>
           </div>
        </div>
        <div className='w-[14px] h-[14px] bg-green-500 rounded-full border-[3px] border-[#e0e5ec] absolute bottom-[2px] right-[2px] shadow-[0_0_8px_rgba(34,197,94,0.6)]'></div>
      </div>
      <span className='text-[12px] text-[#4a5568] font-medium truncate w-[60px] text-center'>{user.userName}</span>
    </div>
  )
}

export default OnlineUser
