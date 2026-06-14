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

function SignUp() {
const [step, setStep] = useState(1);
const [showPassword,setShowPassword]=useState(false)
const [loading,setLoading]=useState(false)
const [name,setName]=useState("")
const [userName,setUserName]=useState("")
const [err,setErr]=useState("")
const [email,setEmail]=useState("")
const [password,setPassword]=useState("")
const [otp, setOtp] = useState("")

const navigate=useNavigate()
const dispatch=useDispatch()

const handleSendOtp=async ()=>{
  if(!name || !userName || !email || !password) {
      setErr("Please fill all fields");
      return;
  }
  if(password.length < 6){
      setErr("Password must be at least 6 characters");
      return;
  }
  setLoading(true)
  setErr("")

  try {
    await axios.post(`${serverUrl}/api/auth/sendSignupOtp`,{email},{withCredentials:true})
    setStep(2)
    setLoading(false)
  } catch (error) {
    setErr(error.response?.data?.message || "Error sending OTP")
    setLoading(false)
  }
}

const handleSignUp=async ()=>{
  if(!otp) {
      setErr("Please enter OTP");
      return;
  }
  setLoading(true)
  setErr("")

  try {
    const result=await axios.post(`${serverUrl}/api/auth/signup`,{name,userName,email,password,otp},{withCredentials:true})
    dispatch(setUserData(result.data))
    setLoading(false)
  } catch (error) {
    setErr(error.response?.data?.message || "Signup failed")
    setLoading(false)
  }
}

  return (
    <div className='w-full h-screen bg-[#e0e5ec] flex flex-col justify-center items-center'>
      <div className='w-[90%] lg:max-w-[70%] h-[600px] bg-[#e0e5ec] rounded-[20px] shadow-[15px_15px_30px_#a3b1c6,-15px_-15px_30px_#ffffff] border border-white/40 flex justify-center items-center overflow-hidden'>
        <div className='w-full lg:w-[50%] h-full flex flex-col items-center p-[20px] gap-[20px] text-[#4a5568]'>

            <div className='flex gap-[10px] items-center text-[24px] font-bold mt-[40px]'>
                <span className='drop-shadow-md text-[#2d3748]'>Sign Up to </span>
                <img src={logo} alt="Logo" className='w-[80px]'/>
            </div>

            {step === 1 && (
                <div className='w-full flex flex-col items-center gap-[15px] mt-[20px]'>
                    <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                        <input type="text" placeholder='Enter Your Name' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0]' required onChange={(e)=>setName(e.target.value)} value={name}/>
                    </div>
                    <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                        <input type="text" placeholder='Enter Username' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0]' required onChange={(e)=>setUserName(e.target.value)} value={userName}/>
                    </div>
                    <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                        <input type="email" placeholder='Enter Email' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
                    </div>
                    <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                        <input type={showPassword?"text":"password"} placeholder='Enter password' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0] pr-[50px]' required onChange={(e)=>setPassword(e.target.value)} value={password}/>
                        {!showPassword?<IoIosEye className='absolute cursor-pointer right-[20px] w-[25px] h-[25px] text-[#4a5568]' onClick={()=>setShowPassword(true)}/>:<IoIosEyeOff className='absolute cursor-pointer right-[20px] w-[25px] h-[25px] text-[#4a5568]' onClick={()=>setShowPassword(false)}/>} 
                    </div>

                    {err && <p className='text-red-500 font-semibold'>{err}</p>}

                    <button className='w-[70%] px-[20px] py-[10px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748] transition-all duration-200 hover:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] font-bold text-[18px] h-[50px] cursor-pointer mt-[20px]' onClick={handleSendOtp} disabled={loading}>{loading?<ClipLoader size={30} color='#2d3748'/>:"Continue"}</button>
                    <p className='cursor-pointer text-[#4a5568] mt-[10px] hover:text-[#2d3748] transition' onClick={()=>navigate("/signin")}>Already Have An Account ? <span className='border-b-2 border-b-[#4a5568] pb-[3px] font-semibold'>Sign In</span></p>
                </div>
            )}

            {step === 2 && (
                <div className='w-full flex flex-col items-center gap-[15px] mt-[20px]'>
                    <p className='text-[16px] text-[#4a5568] mb-[20px] text-center px-[20px]'>An OTP has been sent to <span className='font-bold text-[#2d3748]'>{email}</span></p>
                    <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                        <input type="text" placeholder='Enter OTP' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0] text-center tracking-widest text-[20px]' required onChange={(e)=>setOtp(e.target.value)} value={otp}/>
                    </div>
                    
                    {err && <p className='text-red-500 font-semibold'>{err}</p>}

                    <button className='w-[70%] px-[20px] py-[10px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748] transition-all duration-200 hover:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] font-bold text-[18px] h-[50px] cursor-pointer mt-[30px]' onClick={handleSignUp} disabled={loading}>{loading?<ClipLoader size={30} color='#2d3748'/>:"Sign Up"}</button>
                    <p className='cursor-pointer text-[#4a5568] mt-[10px] hover:text-[#2d3748] transition' onClick={()=>setStep(1)}>Go Back</p>
                </div>
            )}

        </div>
        <div className='md:w-[50%] h-full hidden lg:flex justify-center items-center flex-col gap-[20px] text-[#2d3748] text-[16px] font-semibold border-l border-[#a3b1c6] p-[40px]'>
            <img src={logo1} alt="Logo big" className='w-[60%] drop-shadow-2xl rounded-[50%] '/>
            <p className='text-[22px] tracking-wide text-center mt-[20px]'>Not Just A Platform, It's A place where people can fun </p>
        </div>
      </div>
    </div>
  )
}

export default SignUp
