import { createSlice } from "@reduxjs/toolkit";

const callSlice = createSlice({
    name: "call",
    initialState: {
        isReceivingCall: false,
        caller: null, // User object of the caller
        callerSignal: null, // WebRTC offer
        callType: null, // 'audio' | 'video'
        
        isOutgoingCall: false,
        outgoingReceiver: null, // User object we are calling
        
        callAccepted: false,
        callEnded: false,
    },
    reducers: {
        setIncomingCall: (state, action) => {
            state.isReceivingCall = true;
            state.caller = action.payload.from;
            state.callerSignal = action.payload.signal;
            state.callType = action.payload.callType;
            state.callEnded = false;
            state.callAccepted = false;
        },
        setOutgoingCall: (state, action) => {
            state.isOutgoingCall = true;
            state.outgoingReceiver = action.payload.receiver;
            state.callType = action.payload.callType;
            state.callEnded = false;
            state.callAccepted = false;
        },
        acceptCall: (state) => {
            state.callAccepted = true;
        },
        endCallState: (state) => {
            state.isReceivingCall = false;
            state.caller = null;
            state.callerSignal = null;
            state.callType = null;
            
            state.isOutgoingCall = false;
            state.outgoingReceiver = null;
            
            state.callAccepted = false;
            state.callEnded = true;
        },
        resetCallState: (state) => {
            state.isReceivingCall = false;
            state.caller = null;
            state.callerSignal = null;
            state.callType = null;
            state.isOutgoingCall = false;
            state.outgoingReceiver = null;
            state.callAccepted = false;
            state.callEnded = false;
        }
    }
});

export const { setIncomingCall, setOutgoingCall, acceptCall, endCallState, resetCallState } = callSlice.actions;
export default callSlice.reducer;
