import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MdCall, MdCallEnd, MdVideocam, MdVideocamOff, MdMic, MdMicOff, MdVolumeUp, MdRadioButtonChecked } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../App';
import { setIncomingCall, acceptCall, endCallState, resetCallState } from '../redux/callSlice';
import dp from "../assets/dp.webp";

const CallOverlay = () => {
    const { isReceivingCall, caller, callerSignal, callType, isOutgoingCall, outgoingReceiver, callAccepted } = useSelector(state => state.call);
    const { socket } = useSelector(state => state.socket);
    const { userData } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const [stream, setStream] = useState(null);
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);
    const [remoteStream, setRemoteStream] = useState(null);
    const [remoteVideoOn, setRemoteVideoOn] = useState(true);
    const [callStartTime, setCallStartTime] = useState(null);

    const myVideo = useRef();
    const userVideo = useRef();
    const connectionRef = useRef(null);

    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorderRef = useRef(null);
    const recordedChunksRef = useRef([]);

    const [audioOutputDevices, setAudioOutputDevices] = useState([]);
    const [currentSpeakerIndex, setCurrentSpeakerIndex] = useState(0);

    // Setup socket listeners for incoming calls and events
    useEffect(() => {
        if (!socket) return;

        socket.on("callUser", (data) => {
            dispatch(setIncomingCall({ from: data.from, signal: data.signal, callType: data.callType }));
        });

        socket.on("endCall", () => {
            leaveCall(false);
        });

        socket.on("cameraToggled", (isVideoOn) => {
            setRemoteVideoOn(isVideoOn);
        });

        return () => {
            socket.off("callUser");
            socket.off("endCall");
            socket.off("cameraToggled");
            socket.off("callAccepted");
            socket.off("iceCandidate");
        };
    }, [socket, dispatch]);

    // Handle getting media stream when a call starts (incoming or outgoing)
    useEffect(() => {
        if ((isReceivingCall || isOutgoingCall) && !stream) {
            const isVideo = callType === 'video';
            setVideoOn(isVideo);
            setRemoteVideoOn(isVideo);
            
            navigator.mediaDevices.getUserMedia({ video: isVideo, audio: true })
                .then((currentStream) => {
                    setStream(currentStream);
                    if (isOutgoingCall) {
                        initiateCall(currentStream);
                    }
                })
                .catch(err => {
                    console.log("Error accessing media devices", err);
                    alert("Please allow camera and microphone access to make calls.");
                    leaveCall(true);
                });
        }
    }, [isReceivingCall, isOutgoingCall, callType]);

    // Re-attach stream to local video ref when UI changes
    useEffect(() => {
        if (myVideo.current && stream) {
            myVideo.current.srcObject = stream;
        }
    }, [stream, callAccepted, myVideo.current]);

    useEffect(() => {
        if (userVideo.current && remoteStream) {
            userVideo.current.srcObject = remoteStream;
        }
    }, [remoteStream, callAccepted, userVideo.current]);

    useEffect(() => {
        if (callAccepted) {
            navigator.mediaDevices.enumerateDevices().then(devices => {
                const audioOutputs = devices.filter(device => device.kind === 'audiooutput');
                setAudioOutputDevices(audioOutputs);
            }).catch(err => console.log(err));
        }
    }, [callAccepted]);


    const initiateCall = (mediaStream) => {
        const peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });

        connectionRef.current = peer;

        mediaStream.getTracks().forEach(track => {
            peer.addTrack(track, mediaStream);
        });

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("iceCandidate", { to: outgoingReceiver._id, candidate: event.candidate });
            }
        };

        peer.createOffer().then(offer => {
            return peer.setLocalDescription(offer);
        }).then(() => {
            socket.emit("callUser", {
                userToCall: outgoingReceiver._id,
                signalData: peer.localDescription,
                from: userData,
                callType: callType
            });
        });

        socket.on("callAccepted", (signal) => {
            dispatch(acceptCall());
            setCallStartTime(Date.now());
            peer.setRemoteDescription(new RTCSessionDescription(signal));
        });

        socket.on("iceCandidate", (candidate) => {
            peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
        });
    };

    const answerCall = () => {
        dispatch(acceptCall());
        setCallStartTime(Date.now());

        const peer = new RTCPeerConnection({
            iceServers: [{ urls: "stun:stun.l.google.com:19302" }]
        });
        
        connectionRef.current = peer;

        if (stream) {
            stream.getTracks().forEach(track => {
                peer.addTrack(track, stream);
            });
        }

        peer.ontrack = (event) => {
            setRemoteStream(event.streams[0]);
        };

        peer.onicecandidate = (event) => {
            if (event.candidate) {
                socket.emit("iceCandidate", { to: caller._id, candidate: event.candidate });
            }
        };

        peer.setRemoteDescription(new RTCSessionDescription(callerSignal)).then(() => {
            return peer.createAnswer();
        }).then(answer => {
            return peer.setLocalDescription(answer);
        }).then(() => {
            socket.emit("answerCall", { signal: peer.localDescription, to: caller._id });
        });

        socket.on("iceCandidate", (candidate) => {
            peer.addIceCandidate(new RTCIceCandidate(candidate)).catch(e => console.error(e));
        });
    };

    const leaveCall = async (emitEnd = true) => {
        const endTime = Date.now();
        const durationSeconds = callStartTime ? Math.floor((endTime - callStartTime) / 1000) : 0;
        
        const mins = Math.floor(durationSeconds / 60).toString().padStart(2, '0');
        const secs = (durationSeconds % 60).toString().padStart(2, '0');
        const formattedDuration = durationSeconds > 0 ? `${mins}:${secs}` : '0';

        if (isOutgoingCall && outgoingReceiver) {
            try {
                const formData = new FormData();
                formData.append("message", `CALL_HISTORY||${callType}||${formattedDuration}`);
                await axios.post(`${serverUrl}/api/message/send/${outgoingReceiver._id}`, formData, { withCredentials: true });
            } catch (err) {
                console.log("Failed to save call history", err);
            }
        }

        dispatch(endCallState());
        
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
        
        if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
            mediaRecorderRef.current.stop();
        }

        try {
            if (connectionRef.current) {
                connectionRef.current.close();
                connectionRef.current = null;
            }
        } catch(e) {}

        setRemoteStream(null);
        setCallStartTime(null);
        socket.off("callAccepted");
        socket.off("iceCandidate");

        if (emitEnd) {
            const to = isReceivingCall ? caller?._id : outgoingReceiver?._id;
            if (to) {
                socket.emit("endCall", { to });
            }
        }
        
        // Final cleanup
        setTimeout(() => {
            dispatch(resetCallState());
        }, 1000);
    };

    const toggleMic = () => {
        if (stream) {
            const audioTrack = stream.getAudioTracks()[0];
            if (audioTrack) {
                audioTrack.enabled = !audioTrack.enabled;
                setMicOn(audioTrack.enabled);
            }
        }
    };

    const toggleVideo = () => {
        if (stream) {
            const videoTrack = stream.getVideoTracks()[0];
            if (videoTrack) {
                videoTrack.enabled = !videoTrack.enabled;
                setVideoOn(videoTrack.enabled);
                const to = isReceivingCall ? caller?._id : outgoingReceiver?._id;
                socket.emit("cameraToggled", { to, isVideoOn: videoTrack.enabled });
            }
        }
    };

    const toggleSpeaker = async () => {
        if (audioOutputDevices.length <= 1) {
            alert("No other audio output devices found.");
            return;
        }
        const nextIndex = (currentSpeakerIndex + 1) % audioOutputDevices.length;
        const nextDevice = audioOutputDevices[nextIndex];
        
        if (userVideo.current && typeof userVideo.current.setSinkId !== 'undefined') {
            try {
                await userVideo.current.setSinkId(nextDevice.deviceId);
                setCurrentSpeakerIndex(nextIndex);
            } catch (error) {
                console.log("Error setting audio output device", error);
            }
        } else {
            alert("Your browser does not support changing the audio output device.");
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        } else {
            if (!remoteStream) return;
            try {
                recordedChunksRef.current = [];
                // Use a generic mimeType that is widely supported if specific one fails
                let options = { mimeType: 'video/webm' };
                if (!MediaRecorder.isTypeSupported('video/webm')) {
                    options = { mimeType: 'video/mp4' };
                }
                
                const mediaRecorder = new MediaRecorder(remoteStream, options);

                mediaRecorder.ondataavailable = (event) => {
                    if (event.data.size > 0) {
                        recordedChunksRef.current.push(event.data);
                    }
                };

                mediaRecorder.onstop = () => {
                    const blob = new Blob(recordedChunksRef.current, { type: options.mimeType });
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    document.body.appendChild(a);
                    a.style = 'display: none';
                    a.href = url;
                    a.download = 'call_recording.webm';
                    a.click();
                    window.URL.revokeObjectURL(url);
                    document.body.removeChild(a);
                };

                mediaRecorderRef.current = mediaRecorder;
                mediaRecorder.start();
                setIsRecording(true);
            } catch (err) {
                console.error("Error starting recording:", err);
            }
        }
    };


    if (!isReceivingCall && !isOutgoingCall) return null;

    const remoteUser = isReceivingCall ? caller : outgoingReceiver;

    return (
        <div className="fixed inset-0 z-[500] bg-black/80 flex items-center justify-center backdrop-blur-sm">
            {!callAccepted ? (
                <div className="bg-[#e0e5ec] p-8 rounded-3xl shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] flex flex-col items-center gap-6 w-[300px] animate-explode origin-center">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden border-4 border-white shadow-lg animate-pulse">
                        <img src={remoteUser?.profileImage || dp} alt="Profile" className="w-full h-full object-cover" />
                    </div>
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-[#2d3748]">{remoteUser?.name}</h2>
                        <p className="text-[#4a5568] mt-1 text-sm">{isReceivingCall ? 'Incoming Call...' : 'Calling...'}</p>
                    </div>

                    <div className="flex gap-6 mt-4">
                        {isReceivingCall && (
                            <button onClick={answerCall} className="w-[60px] h-[60px] bg-green-500 rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors">
                                <MdCall className="text-white text-3xl" />
                            </button>
                        )}
                        <button onClick={() => leaveCall(true)} className="w-[60px] h-[60px] bg-red-500 rounded-full flex items-center justify-center shadow-lg hover:bg-red-600 transition-colors">
                            <MdCallEnd className="text-white text-3xl" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full h-full max-w-[1200px] max-h-[800px] flex flex-col relative bg-[#1a1a1a] md:rounded-xl overflow-hidden shadow-2xl animate-explode origin-center">
                    {/* Remote Video (Main Screen) */}
                    <div className="flex-1 w-full relative bg-black flex items-center justify-center">
                        <video 
                            playsInline 
                            ref={userVideo} 
                            autoPlay 
                            className={`w-full h-full object-contain ${(!remoteVideoOn || callType === 'audio') ? 'hidden' : 'block'}`} 
                        />

                        {(!remoteVideoOn || callType === 'audio' || !remoteStream) && (
                            <div className="absolute inset-0 text-white flex flex-col items-center justify-center bg-[#111] z-10">
                                <div className={`w-[150px] h-[150px] md:w-[200px] md:h-[200px] rounded-full overflow-hidden border-4 border-gray-600 mb-4 shadow-2xl relative flex items-center justify-center ${remoteStream ? 'animate-pulse shadow-[0_0_30px_rgba(255,255,255,0.2)]' : ''}`}>
                                   {remoteUser?.profileImage ? (
                                       <img src={remoteUser.profileImage} alt="Profile" className="w-full h-full object-cover" />
                                   ) : (
                                       <FaUserCircle className="w-full h-full text-gray-500 bg-white" />
                                   )}
                                </div>
                                <h2 className="text-3xl font-bold">{remoteUser?.name}</h2>
                                <p className="text-gray-400 mt-2 text-lg">
                                    {!remoteStream ? 'Connecting...' : (callType === 'audio' ? 'Audio Call' : 'Camera Off')}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Local Video (PiP) */}
                    {callType === 'video' && videoOn && (
                        <div className="absolute top-4 right-4 w-[120px] md:w-[200px] aspect-video bg-gray-800 rounded-lg overflow-hidden shadow-xl border-2 border-white/20 z-20">
                            <video playsInline muted ref={myVideo} autoPlay className="w-full h-full object-cover" />
                        </div>
                    )}

                    {/* Call Controls */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-4 bg-white/10 backdrop-blur-md px-6 py-4 rounded-full border border-white/20 z-50">
                        {audioOutputDevices.length > 1 && (
                            <button onClick={toggleSpeaker} className="w-[50px] h-[50px] bg-gray-600/80 hover:bg-gray-500 rounded-full flex items-center justify-center transition-colors" title="Change Speaker">
                                <MdVolumeUp className="text-white text-2xl" />
                            </button>
                        )}
                        <button onClick={toggleRecording} className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors ${isRecording ? 'bg-red-500 hover:bg-red-600 animate-pulse' : 'bg-gray-600/80 hover:bg-gray-500'}`} title={isRecording ? "Stop Recording" : "Start Recording"}>
                            <MdRadioButtonChecked className="text-white text-2xl" />
                        </button>
                        {callType === 'video' && (
                            <button onClick={toggleVideo} className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors ${videoOn ? 'bg-gray-600/80 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'}`}>
                                {videoOn ? <MdVideocam className="text-white text-2xl" /> : <MdVideocamOff className="text-white text-2xl" />}
                            </button>
                        )}
                        <button onClick={toggleMic} className={`w-[50px] h-[50px] rounded-full flex items-center justify-center transition-colors ${micOn ? 'bg-gray-600/80 hover:bg-gray-500' : 'bg-red-500 hover:bg-red-600'}`}>
                            {micOn ? <MdMic className="text-white text-2xl" /> : <MdMicOff className="text-white text-2xl" />}
                        </button>
                        <button onClick={() => leaveCall(true)} className="w-[60px] h-[60px] bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center shadow-lg transition-colors ml-2">
                            <MdCallEnd className="text-white text-3xl" />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CallOverlay;
