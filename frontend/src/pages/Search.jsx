import React, { useEffect, useState } from 'react'
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchData } from '../redux/userSlice';
import dp from "../assets/dp.webp"
import { FaPlay } from "react-icons/fa";
import Post from '../components/Post';
import LoopCard from '../components/LoopCard';
import Nav from '../components/Nav';

function Search() {
    const navigate=useNavigate()
    const[input,setInput]=useState(null)
    const [searchData,setSearchData]=useState()
    const dispatch=useDispatch()
    const { postData } = useSelector(state => state.post);
    const { loopData } = useSelector(state => state.loop);
    const [exploreMedia, setExploreMedia] = useState([]);
    const [selectedMedia, setSelectedMedia] = useState(null);
    const [filteredMedia, setFilteredMedia] = useState([]);

    useEffect(() => {
        const allMedia = [
            ...(postData || []).map(p => ({ ...p, isLoop: false })),
            ...(loopData || []).map(l => ({ ...l, isLoop: true }))
        ];
        const shuffled = allMedia.sort(() => 0.5 - Math.random());
        setExploreMedia(shuffled);
    }, [postData, loopData]);

    const handleSearch=async ()=>{
     
        try {
            const result=await axios.get(`${serverUrl}/api/user/search?keyWord=${input}`,{withCredentials:true})
           setSearchData(result.data)
            console.log(result.data)
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(()=>{
        if(input){
          handleSearch()
          const lowerInput = input.toLowerCase();
          const filtered = exploreMedia.filter(media => 
              media.caption?.toLowerCase().includes(lowerInput) ||
              media.author?.userName?.toLowerCase().includes(lowerInput) ||
              media.author?.name?.toLowerCase().includes(lowerInput)
          );
          setFilteredMedia(filtered);
        } else {
          setFilteredMedia([]);
          setSearchData(null);
        }
    },[input, exploreMedia])
    console.log(searchData)
  return (
    <>
    <div id='main-page' className='w-full min-h-[100vh] bg-[#e0e5ec] flex items-center flex-col gap-[20px] animate-explode origin-center'>
       <div className='w-full h-[80px]  flex items-center gap-[20px] px-[20px] absolute top-0 '>
                      {/* <MdOutlineKeyboardBackspace className='text-[#2d3748] cursor-pointer w-[25px]  h-[25px] ' onClick={() => navigate(`/`)} /> */}
                 
                  </div>
                  <div className='w-full h-[80px] flex items-center justify-center mt-[80px]'>
 <div className='w-[90%] max-w-[800px] h-[80%] rounded-full bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex items-center px-[20px]' >
<FiSearch className='w-[18px] h-[18px] text-[#4a5568]'/>
                    <input type="text" placeholder='search...' className='w-full h-full bg-transparent outline-0 rounded-full px-[20px] text-[#4a5568] placeholder-[#a3b1c6] text-[18px]' onChange={(e)=>setInput(e.target.value)} value={input}/>
                  </div>
                  </div>
   {input && searchData?.length > 0 && (
       <div className='w-[90vw] max-w-[700px] text-[#4a5568] text-[20px] font-semibold mt-[20px] mb-[10px] text-left'>Accounts</div>
   )}

   {input &&  searchData?.map((user, index)=>(
<div key={`user-${index}`} className='w-[90vw] max-w-[700px] h-[60px] rounded-full bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex items-center gap-[20px] px-[10px] cursor-pointer transition-all duration-300 mb-[10px]' onClick={()=>navigate(`/profile/${user.userName}`)}>
<div className='w-[40px] h-[40px] border-2 border-transparent shadow-[2px_2px_5px_#a3b1c6,-2px_-2px_5px_#ffffff] rounded-full cursor-pointer overflow-hidden' >
          <img src={user.profileImage || dp} alt="" className='w-full object-cover'/>
      </div>

      <div className='text-[#2d3748] text-[18px] font-semibold'>
        <div>{user.userName}</div>
           <div className='text-[14px] text-[#4a5568]'>{user.name}</div>
      </div>
   
      </div>

))}   

   {input && filteredMedia?.length > 0 && (
       <>
           <div className='w-[90vw] max-w-[700px] text-[#4a5568] text-[20px] font-semibold mt-[30px] mb-[15px] text-left'>Posts & Videos</div>
           <div className='w-full max-w-[1200px] px-[10px] md:px-[20px] pb-[100px]'>
               <div className='grid grid-cols-3 md:grid-cols-4 gap-[10px] md:gap-[20px]'>
                   {filteredMedia.map((media, index) => (
                       <div 
                           key={`filtered-${index}`} 
                           className='relative aspect-square cursor-pointer overflow-hidden group rounded-xl transition-all duration-300'
                           onClick={() => setSelectedMedia(media)}
                       >
                           <div className='w-full h-full rounded-xl overflow-hidden'>
                               {(media.mediaType === 'video' || media.isLoop) ? (
                                   <>
                                       <video src={`${media.media}#t=0.1`} preload="metadata" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                                       <div className='absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-[5px] rounded-full'>
                                           <FaPlay className='text-white drop-shadow-md w-[12px] h-[12px] md:w-[15px] md:h-[15px]' />
                                       </div>
                                   </>
                               ) : (
                                   <img src={media.media} alt="" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                               )}
                           </div>
                       </div>
                   ))}
               </div>
           </div>
       </>
   )}

   {input && searchData?.length === 0 && filteredMedia?.length === 0 && (
       <div className='text-[22px] text-[#4a5568] font-bold mt-[50px]'>No results found</div>
   )}

{!input && (
    <div className='w-full max-w-[1200px] mt-[20px] px-[10px] md:px-[20px] pb-[100px]'>
        <div className='grid grid-cols-3 md:grid-cols-4 gap-[10px] md:gap-[20px]'>
            {exploreMedia.map((media, index) => (
                <div 
                    key={index} 
                    className='relative aspect-square cursor-pointer overflow-hidden group rounded-xl transition-all duration-300'
                    onClick={() => setSelectedMedia(media)}
                >
                    <div className='w-full h-full rounded-xl overflow-hidden'>
                        {(media.mediaType === 'video' || media.isLoop) ? (
                            <>
                                <video src={`${media.media}#t=0.1`} preload="metadata" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                                <div className='absolute top-4 right-4 bg-black/30 backdrop-blur-sm p-[5px] rounded-full'>
                                    <FaPlay className='text-white drop-shadow-md w-[12px] h-[12px] md:w-[15px] md:h-[15px]' />
                                </div>
                            </>
                        ) : (
                            <img src={media.media} alt="" className='w-full h-full object-cover group-hover:scale-105 transition-transform duration-500' />
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
)}

    </div>
    
    {selectedMedia && (
        <div className='fixed top-0 left-0 w-full h-[100vh] bg-black/40 backdrop-blur-sm z-[500] flex justify-center items-center overflow-y-auto py-[5vh]' onClick={() => setSelectedMedia(null)}>
            <div onClick={(e) => e.stopPropagation()} className="w-full flex justify-center">
                {selectedMedia.isLoop ? (
                    <LoopCard loop={selectedMedia} isModal={true} />
                ) : (
                    <div className="w-full max-w-[600px] flex justify-center mt-[10vh] md:mt-0">
                        <Post post={selectedMedia} isModal={true} />
                    </div>
                )}
            </div>
            <button className='fixed top-[20px] right-[20px] text-white text-[40px] font-bold cursor-pointer hover:text-red-400 z-[600]' onClick={() => setSelectedMedia(null)}>&times;</button>
        </div>
    )}

    {!selectedMedia && <Nav />}
    </>
  )
}

export default Search
