import React from 'react'

function PostSkeleton() {
  return (
    <div className='w-[90%] flex flex-col gap-[10px] bg-[#e0e5ec] items-center shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-2xl pb-[20px] animate-pulse'>
      <div className='w-full h-[80px] flex items-center px-[20px] gap-[20px]'>
        <div className='w-[40px] h-[40px] md:w-[60px] md:h-[60px] rounded-full shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] bg-[#e0e5ec]'></div>
        <div className='w-[150px] h-[20px] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-xl bg-[#e0e5ec]'></div>
      </div>
      <div className='w-[90%] aspect-square shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-2xl bg-[#e0e5ec]'></div>
      <div className='w-full h-[40px] flex items-center px-[20px] mt-[10px] gap-[15px]'>
        <div className='w-[30px] h-[30px] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-full bg-[#e0e5ec]'></div>
        <div className='w-[30px] h-[30px] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-full bg-[#e0e5ec]'></div>
      </div>
    </div>
  )
}

export default PostSkeleton
