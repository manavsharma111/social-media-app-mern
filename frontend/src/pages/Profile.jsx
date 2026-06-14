import axios from 'axios'
import React from 'react'
import { serverUrl } from '../App'
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut, useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import { setProfileData, setUserData } from '../redux/userSlice'
import { useEffect } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import dp from "../assets/dp.webp"
import Nav from '../components/Nav'
import FollowButton from '../components/FollowButton'
import Post from '../components/Post'
import { useState } from 'react'
import { setSelectedUser } from '../redux/messageSlice'
import UsersModal from '../components/UsersModal'

function Profile() {

    const { userName } = useParams()
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [postType,setPostType]=useState("posts")
    const [modalConfig, setModalConfig] = useState(null)
    const { profileData, userData } = useSelector(state => state.user)
    const { postData } = useSelector(state => state.post)
    const handleProfile = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/user/getProfile/${userName}`, { withCredentials: true })
            dispatch(setProfileData(result.data))
        } catch (error) {
            console.log(error)
        }
    }
    const handleLogOut = async () => {
        try {
            const result = await axios.get(`${serverUrl}/api/auth/signout`, { withCredentials: true })
            dispatch(setUserData(null))
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        handleProfile()
    }, [userName, dispatch])
    return (
        <>
        <div id='main-page' className='w-full min-h-screen bg-[#e0e5ec] animate-explode origin-center pb-[100px]'>
            <div className='w-full h-[80px] flex justify-between items-center px-[30px] text-[#2d3748]'>
                {/* <div onClick={() => navigate("/")}><MdOutlineKeyboardBackspace className='text-[#2d3748] cursor-pointer w-[25px]  h-[25px] ' /></div> */}
                <div className='font-semibold text-[20px]'>{profileData?.userName}</div>
                <div className='text-white bg-red-400 font-semibold cursor-pointer px-[20px] h-[40px] flex items-center justify-center rounded-full shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[14px] transition-all hover:bg-red-500' onClick={handleLogOut}>Log Out</div>
            </div>

            <div className='w-full h-[150px] flex items-start  gap-[20px] lg:gap-[50px] pt-[20px] px-[10px] justify-center'>

                <div className='w-[80px] h-[80px] md:w-[140px] md:h-[140px] border-2 border-transparent shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] rounded-full cursor-pointer overflow-hidden'>
                    <img src={profileData?.profileImage || dp} alt="" className='w-full object-cover' />
                </div>
                <div >
                    <div className='font-semibold text-[22px] text-[#2d3748]'>{profileData?.name}</div>
                    <div className='text-[17px] text-[#4a5568]'>{profileData?.profession || "New User"}</div>
                    <div className='text-[17px] text-[#4a5568]'>{profileData?.bio}</div>
                </div>
            </div>

            <div className='w-full h-[100px] flex items-center justify-center gap-[40px] md:gap-[60px] px-[20%] pt-[30px] text-[#2d3748]'>
                <div>
                    <div className='text-[#2d3748] text-[22px] md:text-[30px] font-semibold'>{profileData?.posts.length}</div>
                    <div className='text-[18px] md:text-[22px] text-[#4a5568]'>Posts</div>
                </div>
                <div className='cursor-pointer group' onClick={() => setModalConfig({ title: 'Followers', users: profileData?.followers })}>
                    <div className='flex items-center justify-center gap-[20px] group-hover:scale-105 transition-transform'>
                        <div className='flex relative'>
                            {profileData?.followers?.slice(0, 3).map((user, index) => (

                                <div key={`follower-${index}`} className={`w-[40px] h-[40px]  border-2 border-transparent shadow-[2px_2px_5px_#a3b1c6,-2px_-2px_5px_#ffffff] rounded-full cursor-pointer overflow-hidden ${index>0?`absolute left-[${index*9}px]`:""}`}>
                                    <img src={user.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}


                        </div>
                        <div className='text-[#2d3748] text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.followers.length}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#4a5568] group-hover:text-[#2d3748] transition-colors'>Followers</div>
                </div>
                <div className='cursor-pointer group' onClick={() => setModalConfig({ title: 'Following', users: profileData?.following })}>
                    <div className='flex items-center justify-center gap-[20px] group-hover:scale-105 transition-transform'>
                        <div className='flex relative'>

                             {profileData?.following?.slice(0, 3).map((user, index) => (
                               

                                <div key={`following-${index}`} className={`w-[40px] h-[40px] border-2 border-transparent shadow-[2px_2px_5px_#a3b1c6,-2px_-2px_5px_#ffffff] rounded-full cursor-pointer overflow-hidden ${index>0?`absolute left-[${index*10}px]`:""}`}>
                                    <img src={user?.profileImage || dp} alt="" className='w-full object-cover' />
                                </div>
                            ))}

                        </div>
                        <div className='text-[#2d3748] text-[22px] md:text-[30px] font-semibold'>
                            {profileData?.following.length}
                        </div>
                    </div>
                    <div className='text-[18px] md:text-[22px] text-[#4a5568] group-hover:text-[#2d3748] transition-colors'>Following</div>
                </div>
            </div>

            <div className='w-full h-[80px] flex justify-center items-center gap-[20px] mt-[10px]'>
                {profileData?._id == userData._id
                    &&
                    <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[#e0e5ec] text-[#2d3748] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] cursor-pointer rounded-2xl' onClick={() => navigate("/editprofile")}>Edit Profile</button>}

                {profileData?._id != userData._id
                    &&
                    <>

                        <FollowButton tailwind={'px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[#e0e5ec] text-[#2d3748] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] cursor-pointer rounded-2xl'} targetUserId={profileData?._id} onFollowChange={handleProfile} />
                        <button className='px-[10px] min-w-[150px] py-[5px] h-[40px] bg-[#e0e5ec] text-[#2d3748] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] cursor-pointer rounded-2xl' onClick={()=>{
                            dispatch(setSelectedUser(profileData))
                            navigate("/messageArea")
                        }}>Message</button>
                    </>
                }
            </div>

            <div className='w-full min-h-[100vh]  flex justify-center'>
                <div className='w-full max-w-[900px] flex flex-col items-center rounded-[30px] bg-[#e0e5ec] shadow-[0px_0px_20px_#a3b1c6] relative gap-[20px] pt-[30px] pb-[100px] mb-[20px]'>
                    {profileData?._id==userData._id && <div className='w-[90%] max-w-[500px] h-[80px] bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-full flex justify-center items-center gap-[10px]' >

                <div className={`${postType == "posts" ? "bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748]" : "text-[#4a5568] hover:shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:text-[#2d3748]"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300`} onClick={() => setPostType("posts")}>Posts</div>

                <div className={`${postType == "saved" ? "bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748]" : "text-[#4a5568] hover:shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:text-[#2d3748]"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300`} onClick={() => setPostType("saved")}>Saved</div>

             </div>}


{profileData?._id==userData._id && <>
                   { postType=="posts" && postData.map((post,index)=>(
    post.author?._id==profileData?._id && <Post post={post}/>
))}
{postType=="saved" && postData.map((post,index)=>(
    userData.saved.includes(post._id) && <Post post={post}/>
))}
</> 
}
{profileData?._id!=userData._id &&
                   postData.map((post,index)=>(
    post.author?._id==profileData?._id && <Post post={post}/>
))
}


                    
                </div>
            </div>

            {modalConfig && (
                <UsersModal 
                    title={modalConfig.title} 
                    users={modalConfig.users} 
                    onClose={() => setModalConfig(null)} 
                />
            )}
        </div>
        <Nav />
        </>
    )
}

export default Profile
