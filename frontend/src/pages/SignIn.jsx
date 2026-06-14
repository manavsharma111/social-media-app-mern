import React, { useState } from 'react'
import logo from "../assets/wolf.jpg"
import logo1 from "../assets/wolf.jpg"
import { IoIosEye } from "react-icons/io";
import { IoIosEyeOff } from "react-icons/io";
import axios from "axios"
import { serverUrl } from '../App';
import { ClipLoader } from "react-spinners";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUserData } from '../redux/userSlice';
import { toast } from 'react-toastify';

function SignIn() {
const [showPassword,setShowPassword]=useState(false)
const [loading,setLoading]=useState(false)
const [userName,setUserName]=useState("")
const [password,setPassword]=useState("")
const [rememberMe,setRememberMe]=useState(false)
const [err,setErr]=useState("")
const navigate=useNavigate()
const dispatch=useDispatch()

const handleSignIn=async ()=>{
  setLoading(true)
  setErr("")
  try {
    const result=await axios.post(`${serverUrl}/api/auth/signin`,{userName,password,rememberMe},{withCredentials:true})
   dispatch(setUserData(result.data))
    setLoading(false)
    toast.success("Login Successful!");
  } catch (error) {
    setLoading(false)
    setErr(error.response?.data?.message || "Sign in failed")
    toast.error(error.response?.data?.message || "Sign in failed");
  }
}

  return (
    <div className='w-full h-screen bg-[#e0e5ec] flex flex-col justify-center items-center'>
      <div className='w-[90%] lg:max-w-[70%] h-[600px] bg-[#e0e5ec] rounded-[20px] shadow-[15px_15px_30px_#a3b1c6,-15px_-15px_30px_#ffffff] border border-white/40 flex justify-center items-center overflow-hidden'>
        <div className='w-full lg:w-[50%] h-full flex flex-col items-center justify-center p-[20px] gap-[20px] text-white'>

            <div className='flex gap-[10px] items-center text-[24px] font-bold mt-[20px]'>
                <span className='text-[#2d3748] drop-shadow-md'>Sign In to Wolf </span>
                {/* <img src={logo} alt="Logo" className='w-[80px]'/> */}
            </div>

            <div className='w-full flex flex-col items-center gap-[20px] mt-[30px]'>
                <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                    <input type="text" placeholder='Enter Username or Email' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0]' required onChange={(e)=>setUserName(e.target.value)} value={userName}/>
                </div>

                <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                    <input type={showPassword?"text":"password"} placeholder='Enter password' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0] pr-[50px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
                    {!showPassword?<IoIosEye className='absolute cursor-pointer right-[20px] w-[25px] h-[25px] text-[#4a5568]' onClick={()=>setShowPassword(true)}/>:<IoIosEyeOff className='absolute cursor-pointer right-[20px] w-[25px] h-[25px] text-[#4a5568]' onClick={()=>setShowPassword(false)}/>} 
                </div>

                <div className='w-[90%] px-[10px] flex justify-between items-center text-sm text-[#4a5568]'>
                    <label className='flex items-center gap-[8px] cursor-pointer hover:text-[#2d3748] transition'>
                        <input type="checkbox" className="appearance-none w-[20px] h-[20px] bg-[#e0e5ec] rounded-[5px] shadow-[inset_3px_3px_6px_#a3b1c6,inset_-3px_-3px_6px_#ffffff] cursor-pointer relative outline-none checked:shadow-[inset_2px_2px_4px_#a3b1c6,inset_-2px_-2px_4px_#ffffff] after:content-['✓'] after:absolute after:top-1/2 after:left-1/2 after:-translate-x-1/2 after:-translate-y-1/2 after:text-[#4CAF50] after:text-[14px] after:font-bold after:opacity-0 checked:after:opacity-100" checked={rememberMe} onChange={(e)=>setRememberMe(e.target.checked)}/>
                        Remember Me
                    </label>
                    <span className='cursor-pointer hover:text-[#2d3748] transition' onClick={()=>navigate("/forgot-password")}>
                        Forgot Password?
                    </span>
                </div>

                {err && <p className='text-red-500 font-semibold'>{err}</p>}

                <button className='w-[70%] px-[20px] py-[10px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748] transition-all duration-200 hover:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] font-bold text-[18px] h-[50px] cursor-pointer mt-[10px]' onClick={handleSignIn} disabled={loading}>{loading?<ClipLoader size={30} color='#2d3748'/>:"Sign In"}</button>
                <p className='cursor-pointer text-[#4a5568] mt-[10px] hover:text-[#2d3748] transition' onClick={()=>navigate("/signup")}>Want To Create A New Account ? <span className='border-b-2 border-b-[#4a5568] pb-[3px] font-semibold'>Sign Up</span></p>
            </div>

        </div>
        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center flex-col gap-[20px] text-[#2d3748] text-[16px] font-semibold border-l border-[#a3b1c6] p-[40px]'>
            <img src={logo1} alt="Logo Big" className='w-[60%] drop-shadow-2xl rounded-[50%] '/>
            <p className='text-[22px] tracking-wide text-center mt-[20px]'>Not Just A Platform, It's A place where people can fun </p>
        </div>
      </div>
    </div>
  )
}

export default SignIn
