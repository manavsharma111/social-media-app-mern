import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch } from "react-icons/fi";
import dp from '../assets/dp.webp';

function UsersModal({ title, users, onClose }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const filteredUsers = users?.filter(user => 
    user.userName?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='fixed top-0 left-0 w-full h-[100vh] bg-black/40 backdrop-blur-sm z-[600] flex justify-center items-center py-[5vh]' onClick={onClose}>
      <div 
        className='w-[90%] max-w-[400px] max-h-[80vh] bg-[#e0e5ec] rounded-[30px] shadow-[10px_10px_20px_#a3b1c6,-10px_-10px_20px_#ffffff] flex flex-col relative overflow-hidden animate-explode'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className='w-full h-[60px] flex justify-between items-center px-[20px] shrink-0'>
          <h2 className='text-[#2d3748] text-[20px] font-bold'>{title}</h2>
          <button 
            className='text-[#4a5568] text-[30px] font-bold cursor-pointer hover:text-red-400 transition-colors' 
            onClick={onClose}
          >
            &times;
          </button>
        </div>

        {/* Search Bar */}
        <div className='w-full px-[20px] pb-[10px] shrink-0'>
            <div className='w-full h-[40px] rounded-full bg-[#e0e5ec] shadow-[inset_4px_4px_8px_#a3b1c6,inset_-4px_-4px_8px_#ffffff] flex items-center px-[15px]'>
                <FiSearch className='text-[#4a5568] w-[16px] h-[16px]' />
                <input 
                    type="text" 
                    placeholder="Search..." 
                    className='w-full h-full bg-transparent outline-none px-[10px] text-[#2d3748] placeholder-[#a3b1c6] text-[15px]'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>
        </div>

        <div className='w-full h-[1px] bg-[#a3b1c6]/30 shrink-0'></div>

        {/* Users List */}
        <div className='w-full flex-1 overflow-y-auto p-[20px] flex flex-col gap-[15px]'>
          {filteredUsers && filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
              <div 
                key={`user-${user._id || index}`} 
                className='w-full p-[10px] rounded-2xl bg-[#e0e5ec] shadow-[6px_6px_12px_#a3b1c6,-6px_-6px_12px_#ffffff] hover:shadow-[inset_6px_6px_12px_#a3b1c6,inset_-6px_-6px_12px_#ffffff] flex items-center gap-[15px] cursor-pointer transition-all duration-300'
                onClick={() => {
                  onClose();
                  navigate(`/profile/${user.userName}`);
                }}
              >
                <div className='w-[50px] h-[50px] border-2 border-transparent shadow-[2px_2px_5px_#a3b1c6,-2px_-2px_5px_#ffffff] rounded-full overflow-hidden shrink-0'>
                  <img src={user.profileImage || dp} alt="" className='w-full h-full object-cover' />
                </div>
                <div className='flex flex-col'>
                  <span className='text-[#2d3748] text-[16px] font-semibold'>{user.userName}</span>
                  <span className='text-[#4a5568] text-[14px] line-clamp-1'>{user.name}</span>
                </div>
              </div>
            ))
          ) : (
            <div className='w-full h-[100px] flex justify-center items-center text-[#4a5568] font-semibold'>
              {searchQuery ? "No matching users found." : "No users found."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UsersModal;
