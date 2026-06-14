import axios from 'axios'
import React, { useState } from 'react'
import { ClipLoader } from 'react-spinners'
import { serverUrl } from '../App'
import { useNavigate } from 'react-router-dom';

function ForgotPassword() {
    const [step,setStep]=useState(1)
    const [email,setEmail]=useState("")
    const [otp,setOtp]=useState("")
    const [err,setErr]=useState("")
    const [newPassword,setNewPassword]=useState("")
    const [confirmNewPassword,setConfirmNewPassword]=useState("")
    const [loading,setLoading]=useState(false)
    const navigate=useNavigate()

const handleStep1=async ()=>{
    if(!email) {
        setErr("Please enter email");
        return;
    }
    setLoading(true)
    setErr("")
    try {
        const result=await axios.post(`${serverUrl}/api/auth/sendOtp`,{email},{withCredentials:true})
        setStep(2)
        setLoading(false)
    } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message || "Error sending OTP")
    }
}

const handleStep2=async ()=>{
     if(!otp) {
        setErr("Please enter OTP");
        return;
     }
     setLoading(true)
     setErr("")
    try {
        const result=await axios.post(`${serverUrl}/api/auth/verifyOtp`,{email,otp},{withCredentials:true})
        setLoading(false)
        setStep(3)
    } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message || "Invalid OTP")
    }
}

const handleStep3=async ()=>{
    if(newPassword !== confirmNewPassword){
        return setErr("Passwords Do not match")
    }
    if(newPassword.length < 6) {
        return setErr("Password must be at least 6 characters")
    }
    setErr("")
    setLoading(true)
    try {
        const result=await axios.post(`${serverUrl}/api/auth/resetPassword`,{email,password:newPassword},{withCredentials:true})
        setLoading(false)
        navigate("/signin")
    } catch (error) {
        setLoading(false)
        setErr(error.response?.data?.message || "Error resetting password")
    }
}

  return (
    <div className='w-full h-screen bg-[#e0e5ec] flex flex-col justify-center items-center'>
      
      {step===1 && (
      <div className='w-[90%] max-w-[500px] h-[500px] bg-[#e0e5ec] rounded-[20px] shadow-[15px_15px_30px_#a3b1c6,-15px_-15px_30px_#ffffff] border border-white/40 flex justify-center items-center flex-col text-[#2d3748] p-[20px]'>
          <h2 className='text-[32px] font-bold mb-[40px] drop-shadow-md'>Forgot Password</h2>
          <div className='w-full flex flex-col items-center gap-[20px]'>
              <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                  <input type="email" placeholder='Enter Email' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0]' required onChange={(e)=>setEmail(e.target.value)} value={email}/>
              </div>

              {err && <p className='text-red-500 font-semibold'>{err}</p>}

              <button className='w-[70%] px-[20px] py-[10px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748] transition-all duration-200 hover:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] font-bold text-[18px] h-[50px] cursor-pointer mt-[20px]' disabled={loading} onClick={handleStep1}>{loading?<ClipLoader size={30} color='#2d3748'/>:"Send OTP"}</button>
              <p className='cursor-pointer text-[#4a5568] mt-[15px] hover:text-[#2d3748] transition' onClick={()=>navigate("/signin")}>Back to Sign In</p>
          </div>
      </div>
      )}

      {step===2 && (
      <div className='w-[90%] max-w-[500px] h-[500px] bg-[#e0e5ec] rounded-[20px] shadow-[15px_15px_30px_#a3b1c6,-15px_-15px_30px_#ffffff] border border-white/40 flex justify-center items-center flex-col text-[#2d3748] p-[20px]'>
          <h2 className='text-[32px] font-bold mb-[20px] drop-shadow-md'>Verify OTP</h2>
          <p className='text-[16px] text-[#4a5568] mb-[30px] text-center'>An OTP has been sent to <span className='font-bold text-[#2d3748]'>{email}</span></p>
          
          <div className='w-full flex flex-col items-center gap-[20px]'>
              <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                  <input type="text" placeholder='Enter OTP' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0] text-center tracking-widest text-[20px]' required onChange={(e)=>setOtp(e.target.value)} value={otp}/>
              </div>

              {err && <p className='text-red-500 font-semibold'>{err}</p>}

              <button className='w-[70%] px-[20px] py-[10px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748] transition-all duration-200 hover:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] font-bold text-[18px] h-[50px] cursor-pointer mt-[20px]' disabled={loading} onClick={handleStep2}>{loading?<ClipLoader size={30} color='#2d3748'/>:"Submit"}</button>
              <p className='cursor-pointer text-[#4a5568] mt-[15px] hover:text-[#2d3748] transition' onClick={()=>setStep(1)}>Go Back</p>
          </div>
      </div>
      )}

      {step===3 && (
      <div className='w-[90%] max-w-[500px] h-[500px] bg-[#e0e5ec] rounded-[20px] shadow-[15px_15px_30px_#a3b1c6,-15px_-15px_30px_#ffffff] border border-white/40 flex justify-center items-center flex-col text-[#2d3748] p-[20px]'>
          <h2 className='text-[32px] font-bold mb-[40px] drop-shadow-md'>Reset Password</h2>
          <div className='w-full flex flex-col items-center gap-[20px]'>
              <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                  <input type="password" placeholder='Enter New Password' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0]' required onChange={(e)=>setNewPassword(e.target.value)} value={newPassword}/>
              </div>
              <div className='relative flex items-center justify-start w-[90%] h-[50px]'>
                  <input type="password" placeholder='Confirm New Password' className='w-[100%] h-[100%] px-[20px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] text-[#4a5568] transition-all duration-300 focus:outline-none focus:shadow-[inset_8px_8px_16px_#8898b0,inset_-8px_-8px_16px_#ffffff] placeholder:text-[#a0aec0]' required onChange={(e)=>setConfirmNewPassword(e.target.value)} value={confirmNewPassword}/>
              </div>

              {err && <p className='text-red-500 font-semibold'>{err}</p>}

              <button className='w-[70%] px-[20px] py-[10px] bg-[#e0e5ec] border-none rounded-[15px] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] text-[#2d3748] transition-all duration-200 hover:shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] active:shadow-[inset_5px_5px_10px_#a3b1c6,inset_-5px_-5px_10px_#ffffff] disabled:opacity-60 disabled:cursor-not-allowed disabled:shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff] font-bold text-[18px] h-[50px] cursor-pointer mt-[20px]' disabled={loading} onClick={handleStep3}>{loading?<ClipLoader size={30} color='#2d3748'/>:"Reset Password"}</button>
          </div>
      </div>
      )}
      
    </div>
  )
}

export default ForgotPassword
