import React, { useState } from 'react'
import logo from "../assets/wolf.jpg"
import { FaRegHeart } from "react-icons/fa6";
import dp from "../assets/dp.webp"
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { setUserData } from '../redux/userSlice';
import OtherUser from './OtherUser';
import Notifications from '../pages/Notifications';
import { useNavigate } from 'react-router-dom';

function LeftHome() {

    const {userData ,suggestedUsers}=useSelector(state=>state.user)
    const [showNotification,setShowNotification]=useState(false)
const dispatch=useDispatch()
const navigate=useNavigate()
const {notificationData}=useSelector(state=>state.user)
    const handleLogOut=async ()=>{
        try {
            const result=await axios.get(`${serverUrl}/api/auth/signout`,{withCredentials:true})
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }


  return (
    <div className={`w-[23%] hidden lg:flex flex-col h-[96vh] my-[2vh] ml-[1%] bg-[#e0e5ec] shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] rounded-[30px] z-[10]  ${showNotification?"overflow-hidden":"overflow-x-hidden overflow-y-auto"}`}>
      <div className='w-full min-h-[100px] flex items-center justify-between px-[20px] py-[10px]'>
        <img src={logo} alt="" className='w-[60px] rounded-2xl shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff]'/>
        <div className='relative z-[100] w-[45px] h-[45px] flex items-center justify-center rounded-full shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] cursor-pointer transition-all' onClick={()=>setShowNotification(prev=>!prev)}>
      <FaRegHeart className='text-[#4a5568] w-[20px] h-[20px]'/>
      {notificationData?.length>0 && notificationData.some((noti)=>noti.isRead===false) && (<div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>)}
     
        </div>
      </div>

      {!showNotification && <>
<div className='flex items-center w-full justify-between gap-[5px] px-[10px] xl:px-[20px] pb-[20px] mb-[10px]'>
        <div className='flex items-center gap-[10px] xl:gap-[15px] cursor-pointer min-w-0' onClick={() => navigate(`/profile/${userData.userName}`)}>
<div className='w-[45px] h-[45px] xl:w-[60px] xl:h-[60px] shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] rounded-full p-[3px] overflow-hidden flex-shrink-0'>
    <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full'/>
</div>
<div className='flex flex-col min-w-0'>
    <div className='text-[14px] xl:text-[18px] text-[#2d3748] font-bold truncate'>{userData.userName}</div>
    <div className='text-[12px] xl:text-[14px] text-[#718096] font-medium truncate'>{userData.name}</div>
</div>
</div>
<div className='text-white bg-red-400 font-bold cursor-pointer w-[40px] h-[40px] xl:w-[50px] xl:h-[50px] flex items-center justify-center rounded-full shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] text-[10px] xl:text-[12px] transition-all hover:bg-red-500 flex-shrink-0 ml-1' onClick={handleLogOut}>LogOut</div>
      </div>

<div className='w-full flex flex-col gap-[10px] p-[20px]'>
    <h1 className='text-[#4a5568] font-bold text-[14px] uppercase tracking-wider mb-[10px] pl-[5px]'>Suggested Users</h1>
    {suggestedUsers && suggestedUsers.slice(0,3).map((user,index)=>(
        <OtherUser key={index} user={user}/>
    ))}
</div>
      </>}

      {showNotification && <Notifications/>}
      


    </div>
  )
}

export default LeftHome