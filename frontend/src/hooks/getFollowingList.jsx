import axios from 'axios'
import React, { useEffect } from 'react'
import { serverUrl } from '../App'
import { useDispatch, useSelector } from 'react-redux'
import { setFollowing, setUserData } from '../redux/userSlice'
import { setCurrentUserStory } from '../redux/storySlice'

function getFollowingList() {
    const dispatch=useDispatch()
    const {storyData}=useSelector(state=>state.story)
    const {userData} = useSelector(state=>state.user)
  useEffect(()=>{
    if(!userData) return;
const fetchFollowingList=async ()=>{
    try {
        const result=await axios.get(`${serverUrl}/api/user/followingList`,{withCredentials:true})
         dispatch(setFollowing(result.data))
    } catch (error) {
        console.log(error)
    }
}
fetchFollowingList()
  },[dispatch,userData])
}

export default getFollowingList
