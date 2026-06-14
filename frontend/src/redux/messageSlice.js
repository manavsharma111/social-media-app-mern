import { createSlice } from "@reduxjs/toolkit"
const messageSlice=createSlice({
    name:"message",
    initialState:{
        selectedUser:null,
        messages:[],
        prevChatUsers:null
    },
    reducers:{
       setSelectedUser:(state,action)=>{
        state.selectedUser=action.payload
       } ,
        setMessages:(state,action)=>{
        state.messages=action.payload
       } ,
       setPrevChatUsers:(state,action)=>{
           state.prevChatUsers=action.payload
       },
       markUserAsRead: (state, action) => {
           const userId = action.payload;
           if (state.prevChatUsers) {
               const user = state.prevChatUsers.find(u => u._id === userId);
               if (user) {
                   user.unreadCount = 0;
               }
           }
       }
    }

})

export const {setSelectedUser,setMessages,setPrevChatUsers,markUserAsRead}=messageSlice.actions
export default messageSlice.reducer