import React from 'react'
import { useState } from 'react';
import { MdOutlineKeyboardBackspace, MdClose } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FiPlusSquare } from "react-icons/fi";
import VideoPlayer from '../components/VideoPlayer';
import axios from 'axios';
import { serverUrl } from '../App';
import { useDispatch, useSelector } from 'react-redux';
import { setPostData } from '../redux/postSlice';
import { setCurrentUserStory, setStoryData } from '../redux/storySlice';
import { setLoopData } from '../redux/loopSlice';
import { ClipLoader } from 'react-spinners';
import { setUserData } from '../redux/userSlice';
import { useEffect, useRef } from 'react';
import EmojiPicker from 'emoji-picker-react';
import { MdOutlineEmojiEmotions } from "react-icons/md";
import { toast } from 'react-toastify';

function Upload({ onClose }) {
    const navigate = useNavigate()
    const uploadRef = useRef()
    const [isClosing, setIsClosing] = useState(false)
    const [uploadType, setUploadType] = useState("post")
    const [frontendMedia, setFrontendMedia] = useState(null)
    const [backendMedia, setBackendMedia] = useState(null)
    const [frontendAudio, setFrontendAudio] = useState(null)
    const [backendAudio, setBackendAudio] = useState(null)
    const [mediaType, setMediaType] = useState("")
    const [caption,setCaption]=useState("")
    const [activeFilter, setActiveFilter] = useState("none")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [multipleMedia, setMultipleMedia] = useState([])
    const mediaInput = useRef()
    const audioInput = useRef()
    const dispatch=useDispatch()
    const {postData}=useSelector(state=>state.post)
     const {storyData}=useSelector(state=>state.story)
      const {loopData}=useSelector(state=>state.loop)
      const [loading,setLoading]=useState(false)
    const handleImage = (e) => {
        const files = Array.from(e.target.files);
        if(files.length > 0) {
            setBackendMedia(files[0]);
            setFrontendMedia(URL.createObjectURL(files[0]));
            setMediaType(files[0].type.split("/")[0]);
            
            if(uploadType === "post") {
                setMultipleMedia(files);
            }
        }
    }

    const handleAudio = (e) => {
        const files = Array.from(e.target.files);
        if(files.length > 0) {
            setBackendAudio(files[0]);
            setFrontendAudio(URL.createObjectURL(files[0]));
        }
    }

    const handleClearMedia = () => {
        setFrontendMedia(null);
        setBackendMedia(null);
        setMultipleMedia([]);
        setCaption("");
        setMediaType("");
        setFrontendAudio(null);
        setBackendAudio(null);
        if(mediaInput.current) mediaInput.current.value = "";
        if(audioInput.current) audioInput.current.value = "";
    };

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            if (onClose) {
                onClose();
            } else {
                navigate("/");
            }
        }, 400);
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (uploadRef.current && !uploadRef.current.contains(event.target)) {
                handleClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [onClose]);

const uploadPost=async (mediaToUpload)=>{
   
    try {
        const formData=new FormData()
        formData.append("caption",caption)
        formData.append("mediaType",mediaType)
        
        if (multipleMedia.length > 0) {
            multipleMedia.forEach(file => {
                formData.append("media", file);
            });
        } else {
            formData.append("media", mediaToUpload || backendMedia)
        }
        
        if (backendAudio) {
            formData.append("audio", backendAudio)
        }
        
        const result=await axios.post(`${serverUrl}/api/post/upload`,formData,{withCredentials:true})
       dispatch(setPostData([...postData,result.data]))
       setLoading(false)
       toast.success("Post uploaded successfully!");
       handleClose()
    } catch (error) {
        console.log(error)
        toast.error("Failed to upload post!");
        setLoading(false)
    }
}

const uploadStory=async (mediaToUpload)=>{
    try {
        const formData=new FormData()
        formData.append("mediaType",mediaType)
        formData.append("media", mediaToUpload || backendMedia)
        if (backendAudio) {
            formData.append("audio", backendAudio)
        }
        const result=await axios.post(`${serverUrl}/api/story/upload`,formData,{withCredentials:true})
       dispatch(setCurrentUserStory(result.data))
         setLoading(false)
         toast.success("Story uploaded successfully!");
       handleClose()
    } catch (error) {
        console.log(error)
        toast.error("Failed to upload story!");
        setLoading(false)
    }
}
const uploadLoop=async ()=>{
    try {
        const formData=new FormData()
        formData.append("caption",caption)
        formData.append("mediaType",mediaType)
        formData.append("media",backendMedia)
        if (backendAudio) {
            formData.append("audio", backendAudio)
        }
        const result=await axios.post(`${serverUrl}/api/loop/upload`,formData,{withCredentials:true})
         dispatch(setLoopData([...loopData,result.data]))
         setLoading(false)
         toast.success("Wheel uploaded successfully!");
       handleClose()
    } catch (error) {
        console.log(error)
        toast.error("Failed to upload wheel!");
        setLoading(false)
    }
}

const applyFilterToImage = (imageUrl, filter) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.filter = filter;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        resolve(new File([blob], "filtered.jpg", { type: "image/jpeg" }));
      }, "image/jpeg", 0.9);
    };
    img.src = imageUrl;
  });
};

const handleUpload=async ()=>{
    setLoading(true)
    let uploadMedia = backendMedia;
    
    if(mediaType === "image" && activeFilter !== "none") {
        uploadMedia = await applyFilterToImage(frontendMedia, activeFilter);
    }
    
    if(uploadType=="post"){
        uploadPost(uploadMedia)
    }else if(uploadType=="story"){
        uploadStory(uploadMedia)
    }else{
        uploadLoop()
    }
}

    const filters = [
        { name: "Normal", value: "none" },
        { name: "Grayscale", value: "grayscale(100%)" },
        { name: "Sepia", value: "sepia(100%)" },
        { name: "Contrast", value: "contrast(150%)" },
        { name: "Cyberpunk", value: "hue-rotate(90deg) saturate(200%)" }
    ];

    const handleEmojiClick = (emojiObject) => {
        setCaption(prev => prev + emojiObject.emoji);
    };

    return (
        <div className={`fixed top-0 left-0 w-full h-[100vh] bg-black/20 z-[500] flex justify-center items-center lg:py-[5vh] transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div ref={uploadRef} className={`w-full lg:w-[700px] h-[100vh] lg:h-[90vh] bg-[#e0e5ec] lg:rounded-[40px] lg:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] flex flex-col items-center relative overflow-y-auto origin-center ${isClosing ? 'animate-explode-out' : 'animate-explode'}`} onClick={(e) => e.stopPropagation()}>
                
                <div className='w-full h-[60px] flex items-center justify-between px-[20px]'>
                   <MdOutlineKeyboardBackspace className='text-[#4a5568] hover:text-[#2d3748] cursor-pointer w-[30px]  h-[30px] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-full p-[2px]' onClick={handleClose} />
                    <div className='text-[20px] font-bold text-[#2d3748]'>Create {uploadType === 'loop' ? 'Wheels' : uploadType}</div>
                    <div></div>
                </div>

            <div className='w-[90%] max-w-[600px] h-[80px] bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-full flex justify-around items-center gap-[10px]' >

                <div className={`${uploadType == "post" ? "bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748]" : "text-[#4a5568] hover:shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:text-[#2d3748]"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300`} onClick={() => setUploadType("post")}>Post</div>

                <div className={`${uploadType == "story" ? "bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748]" : "text-[#4a5568] hover:shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:text-[#2d3748]"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300`} onClick={() => setUploadType("story")}>Story</div>

                <div className={`${uploadType == "loop" ? "bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748]" : "text-[#4a5568] hover:shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:text-[#2d3748]"}  w-[28%] h-[80%] flex justify-center items-center text-[19px] font-semibold rounded-full cursor-pointer transition-all duration-300`} onClick={() => setUploadType("loop")}>Wheels</div>
            </div>

            {!frontendMedia && <div className='w-[80%] max-w-[500px] h-[250px] bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex flex-col items-center justify-center rounded-3xl mt-[15vh]'>
                <input type="file" accept={uploadType=="loop"?"video/*":""} multiple={uploadType === "post"} hidden ref={mediaInput} onChange={handleImage} />
                <FiPlusSquare className='text-[#4a5568] cursor-pointer w-[60px] h-[60px] mb-4' onClick={() => mediaInput.current.click()} />
                <button className='px-[30px] py-[10px] bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-full text-[#4a5568] font-bold transition-all duration-300 cursor-pointer' onClick={()=>mediaInput.current.click()}>Select from storage</button>
            </div>}

            {frontendMedia &&
                <div className='w-[80%] max-w-[500px] min-h-[350px] flex flex-col items-center justify-center mt-[5vh] relative'>
                    <div 
                        className='absolute -top-[15px] -right-[15px] lg:-right-[30px] w-[35px] h-[35px] bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] active:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] rounded-full flex justify-center items-center cursor-pointer z-[100]'
                        onClick={handleClearMedia}
                    >
                        <MdClose className='text-[#4a5568] w-[20px] h-[20px]' />
                    </div>
             {mediaType=="image" && <div className='w-[80%] max-w-[500px] flex flex-col items-center justify-center mt-[5vh] gap-[15px]'>
                <img src={frontendMedia} alt="" className='h-[200px] rounded-2xl shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] object-cover' style={{ filter: activeFilter }}/>
                
                <div className='w-full overflow-x-auto flex gap-[10px] pb-[10px] px-[5px] hide-scrollbar'>
                    {filters.map(filter => (
                        <div 
                            key={filter.name}
                            className={`min-w-[80px] h-[30px] flex items-center justify-center rounded-full text-[12px] font-semibold cursor-pointer transition-all duration-300 ${activeFilter === filter.value ? 'bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] text-[#2d3748]' : 'bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] text-[#4a5568] hover:text-[#2d3748]'}`}
                            onClick={() => setActiveFilter(filter.value)}
                        >
                            {filter.name}
                        </div>
                    ))}
                </div>

                {uploadType!="story" &&  (
                    <div className='w-full relative mt-[20px]'>
                        {showEmojiPicker && (
                            <div className='absolute bottom-[100%] left-0 z-[600] mb-[10px] shadow-2xl'>
                                <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" width={300} height={350}/>
                            </div>
                        )}
                        <div className='w-full bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-xl flex items-center px-[10px]'>
                            <MdOutlineEmojiEmotions className='w-[28px] h-[28px] text-[#4a5568] hover:text-[#2d3748] cursor-pointer' onClick={() => setShowEmojiPicker(prev => !prev)} />
                            <input type='text' className='w-full outline-none px-[10px] py-[10px] text-[#4a5568] placeholder-[#a3b1c6] bg-transparent' placeholder='write caption' onChange={(e)=>setCaption(e.target.value)} value={caption}/>
                        </div>
                    </div>
                )}
               
                    <div className='w-full flex flex-col mt-[20px] mb-[10px]'>
                        <input type="file" accept="audio/*" hidden ref={audioInput} onChange={handleAudio} />
                        <button className='w-full py-[10px] cursor-pointer bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-xl text-[#4a5568] font-bold transition-all duration-300' onClick={() => audioInput.current.click()}>
                            {frontendAudio ? 'Change Background Music' : 'Add Background Music'}
                        </button>
                        {frontendAudio && <audio controls src={frontendAudio} className='w-full h-[40px] mt-[15px]'></audio>}
                    </div>

                </div>}

                 {mediaType=="video" && <div className='w-[80%] max-w-[500px] h-[250px]  flex flex-col items-center justify-center  mt-[5vh] '>
                <VideoPlayer media={frontendMedia}/>
                {uploadType!="story" &&  (
                    <div className='w-full relative mt-[20px]'>
                        {showEmojiPicker && (
                            <div className='absolute bottom-[100%] left-0 z-[600] mb-[10px] shadow-2xl'>
                                <EmojiPicker onEmojiClick={handleEmojiClick} theme="light" width={300} height={350}/>
                            </div>
                        )}
                        <div className='w-full bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-xl flex items-center px-[10px]'>
                            <MdOutlineEmojiEmotions className='w-[28px] h-[28px] text-[#4a5568] hover:text-[#2d3748] cursor-pointer' onClick={() => setShowEmojiPicker(prev => !prev)} />
                            <input type='text' className='w-full outline-none px-[10px] py-[10px] text-[#4a5568] placeholder-[#a3b1c6] bg-transparent' placeholder='write caption' onChange={(e)=>setCaption(e.target.value)} value={caption}/>
                        </div>
                    </div>
                )}
               
                </div>}


               

                </div>}
                {frontendMedia && <button className='px-[10px] w-[60%] max-w-[400px] py-[5px] h-[50px] bg-[#e0e5ec] text-[#2d3748] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] active:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] mt-[50px] mb-[30px] cursor-pointer rounded-2xl' onClick={handleUpload}>{loading?<ClipLoader size={30} color='#2d3748'/>:`Upload ${uploadType === 'loop' ? 'Wheels' : uploadType}` }</button>}

            </div>
        </div>
    )
}

export default Upload