import React from 'react'
import Messages from '../pages/Messages'

function RightHome() {
  return (
    <div className='w-[23%] hidden lg:flex flex-col h-[96vh] my-[2vh] mr-[1%] bg-[#e0e5ec] shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] rounded-[30px] z-[10] overflow-hidden'>
      <Messages/>
    </div>
  )
}

export default RightHome
