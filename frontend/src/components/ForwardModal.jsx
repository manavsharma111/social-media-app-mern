import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import dp from "../assets/dp.webp";
import { MdClose, MdSearch } from "react-icons/md";

function ForwardModal({ onClose, onForward }) {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                if (searchQuery.trim() === "") {
                    // Fetch previous chats by default
                    const res = await axios.get(`${serverUrl}/api/message/prevChats`, { withCredentials: true });
                    setUsers(res.data);
                } else {
                    const res = await axios.get(`${serverUrl}/api/user/search?search=${searchQuery}`, { withCredentials: true });
                    setUsers(res.data);
                }
            } catch (err) {
                console.log(err);
            }
        };
        const timeout = setTimeout(fetchUsers, 300);
        return () => clearTimeout(timeout);
    }, [searchQuery]);

    const toggleUser = (userId) => {
        setSelectedUsers(prev => 
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    return (
        <div className="fixed inset-0 z-[500] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="w-full max-w-md bg-[#e0e5ec] shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] rounded-3xl p-6 flex flex-col max-h-[80vh]">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-[#2d3748]">Forward To...</h2>
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] cursor-pointer text-[#4a5568]" onClick={onClose}>
                        <MdClose className="w-5 h-5" />
                    </div>
                </div>

                <div className="relative w-full mb-4">
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        className="w-full h-12 bg-[#e0e5ec] shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] rounded-full px-5 pl-12 text-[#4a5568] outline-none"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <MdSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#a3b1c6] w-6 h-6" />
                </div>

                <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-3 hide-scrollbar">
                    {users.map(user => (
                        <div 
                            key={user._id} 
                            className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all ${selectedUsers.includes(user._id) ? 'bg-[#d1d8e0] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff]' : 'bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] hover:shadow-[inset_2px_2px_5px_#a3b1c6,inset_-2px_-2px_5px_#ffffff]'}`}
                            onClick={() => toggleUser(user._id)}
                        >
                            <div className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                                <img src={user.profileImage || dp} alt="" className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 overflow-hidden">
                                <div className="font-bold text-[#2d3748] truncate">{user.userName}</div>
                                <div className="text-sm text-[#718096] truncate">{user.name}</div>
                            </div>
                            <div className="w-6 h-6 rounded-md border-2 border-[#a3b1c6] flex items-center justify-center flex-shrink-0">
                                {selectedUsers.includes(user._id) && <div className="w-3 h-3 bg-blue-500 rounded-sm" />}
                            </div>
                        </div>
                    ))}
                    {users.length === 0 && (
                        <div className="text-center text-[#718096] py-10 font-medium">No users found</div>
                    )}
                </div>

                <div className="mt-4 pt-4 border-t border-white/50 flex gap-3">
                    <button 
                        className="flex-1 h-12 rounded-full bg-[#e0e5ec] shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] font-bold text-[#4a5568] hover:shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] transition-all"
                        onClick={onClose}
                    >
                        Cancel
                    </button>
                    <button 
                        className={`flex-1 h-12 rounded-full font-bold transition-all ${selectedUsers.length > 0 ? 'bg-blue-500 text-white shadow-[4px_4px_8px_#a3b1c6,-4px_-4px_8px_#ffffff] hover:bg-blue-600' : 'bg-[#e0e5ec] text-[#a3b1c6] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] cursor-not-allowed'}`}
                        disabled={selectedUsers.length === 0}
                        onClick={() => onForward(selectedUsers)}
                    >
                        Forward
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ForwardModal;
