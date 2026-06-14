import React from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import LoopCard from '../components/LoopCard';
import { useSelector } from 'react-redux';
import Nav from '../components/Nav';

function Loops() {
    const navigate=useNavigate()
    const {loopData}=useSelector(state=>state.loop)
  return (
    <>
    <div id='main-page' className='w-screen h-screen bg-[#e0e5ec] overflow-hidden flex justify-center items-center animate-explode origin-center'>
       <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px] fixed top-[10px] left-[10px] z-[100]'>
                      <MdOutlineKeyboardBackspace className='text-[#2d3748] cursor-pointer w-[25px]  h-[25px] ' onClick={() => navigate(`/`)} />
                      <h1 className='text-[#2d3748] text-[20px] font-semibold'>Wheels</h1>
                  </div>
            <div className='h-[100vh] overflow-y-scroll snap-y     snap-mandatory scrollbar-hide'>
{loopData.map((loop,index)=>(
    <div className='h-screen w-screen snap-start flex justify-center items-center' key={index}>
    <LoopCard loop={loop} />
    </div>
))}
            </div>
    </div>
    {/* <Nav /> */}
    </>
  )
}

export default Loops
