import React from 'react'
import logo from "../assets/wolf.jpg"
import { FaRegHeart } from "react-icons/fa6";
import StoryDp from './StoryDp';
import Nav from './Nav';
import { useSelector } from 'react-redux';
import Post from './Post';
import PostSkeleton from './PostSkeleton';
import { useNavigate } from 'react-router-dom';
function Feed() {
  const { postData } = useSelector(state => state.post)
  const { userData, notificationData } = useSelector(state => state.user)
  const { storyList, currentUserStory } = useSelector(state => state.story)
  const navigate = useNavigate()
  return (
    <div className='lg:w-[46%] w-full bg-[#e0e5ec] min-h-[100vh] lg:min-h-0 lg:h-[96vh] lg:my-[2vh] lg:mx-[1%] lg:rounded-[30px] lg:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] relative lg:overflow-y-auto '>
      <div className='w-full h-[100px] flex items-center justify-between p-[20px] lg:hidden'>
        <img src={logo} alt="" className='w-[60px] rounded-2xl shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff]' />
        <div className='flex items-center gap-[10px]'>
          <div className='relative' onClick={() => navigate("/notifications")}>
            <FaRegHeart className='text-[#4a5568] w-[25px] h-[25px]' />
            {notificationData?.length > 0 && notificationData.some((noti) => noti.isRead === false) && (<div className='w-[10px] h-[10px] bg-blue-600 rounded-full absolute top-0 right-[-5px]'></div>)}

          </div>
        </div>
      </div>

      <div className='flex w-full justify-start overflow-x-auto hide-scrollbar gap-[15px] items-start px-[20px] pt-[20px] pb-[10px]'>

        <StoryDp userName={"Your Story"} ProfileImage={userData.profileImage} story={currentUserStory} />

        {storyList?.map((story, index) => (

          <StoryDp userName={story.author.userName} ProfileImage={story.author.profileImage} story={story} key={index} />
        ))}





      </div>

      <div className='w-full min-h-[100vh] flex flex-col items-center gap-[20px] p-[10px] pt-[40px] lg:pt-[20px] bg-[#e0e5ec] lg:shadow-none shadow-[0px_-10px_20px_#a3b1c6] lg:rounded-none rounded-t-[60px] relative pb-[120px]'>



        {!postData && [1, 2, 3].map((_, index) => (
          <PostSkeleton key={`skeleton-${index}`} />
        ))}

        {postData && postData.map((post, index) => (
          <Post post={post} key={index} />
        ))}

      </div>

    </div>
  )
}

export default Feed
