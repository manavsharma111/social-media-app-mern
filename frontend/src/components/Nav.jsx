import React, { useState, useEffect } from 'react'
import { GoHomeFill } from "react-icons/go";
import { FiSearch } from "react-icons/fi";
import { RxVideo } from "react-icons/rx";
import { FiPlusSquare } from "react-icons/fi";
import { BiMessageAltDetail } from "react-icons/bi";
import dp from "../assets/dp.webp"
import { useNavigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Upload from '../pages/Upload';

function Nav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { userData } = useSelector(state => state.user)
  const [showUpload, setShowUpload] = useState(false)
  const [activePath, setActivePath] = useState(location.pathname)

  useEffect(() => {
    setActivePath(location.pathname)
  }, [location.pathname])

  const getIconClass = (path) => {
    const isActive = activePath === path || (path.startsWith('/profile') && activePath.startsWith('/profile'))
    return `w-[45px] h-[45px] flex justify-center items-center rounded-full cursor-pointer transition-all duration-300 ${
      isActive 
        ? 'shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] animate-explode bg-white/20' 
        : 'hover:scale-110'
    }`
  }

  return (
    <>
    <div className='fixed bottom-[20px] left-0 w-full flex justify-center z-[100] pointer-events-none'>
      <div className='w-[90%] lg:w-[40%] h-[80px] bg-white/40 backdrop-blur-md border border-white/50 flex justify-around items-center rounded-full shadow-[0_8px_32px_0_rgba(31,38,135,0.07)] pointer-events-auto'>
      <div className={getIconClass('/')} onClick={() => navigate("/")}>
        <GoHomeFill className='text-[#2d3748] w-[26px] h-[26px]'/>
      </div>
      
      <div className={getIconClass('/search')} onClick={() => navigate("/search")}>
        <FiSearch className='text-[#2d3748] w-[26px] h-[26px]'/>
      </div>
      
      <div className={`w-[45px] h-[45px] flex justify-center items-center rounded-full cursor-pointer hover:scale-110 transition-all duration-300`} onClick={() => setShowUpload(true)}>
        <FiPlusSquare className='text-[#2d3748] w-[26px] h-[26px]'/>
      </div>
      
      <div className={getIconClass('/loops')} onClick={() => navigate("/loops")}>
        <RxVideo className='text-[#2d3748] w-[29px] h-[29px]'/>
      </div>

      <div className={`lg:hidden ${getIconClass('/messages')}`} onClick={() => navigate("/messages")}>
        <BiMessageAltDetail className='text-[#2d3748] w-[26px] h-[26px]'/>
      </div>
      
      <div 
        className={`${getIconClass(`/profile/${userData.userName}`)} overflow-hidden border-2 border-transparent p-0`} 
        onClick={() => navigate(`/profile/${userData.userName}`)}
      >
         <img src={userData.profileImage || dp} alt="" className='w-full h-full object-cover rounded-full'/>
      </div>
      </div>
    </div>
    {showUpload && <Upload onClose={() => setShowUpload(false)} />}
    </>
  )
}

export default Nav
