// components/Conversation.js
import React from 'react';
import { useSocketContext } from '../../context/SocketContext';
import useConversation from '../../zustand/useConversation';

const Conversation = ({ conversation, lastIdx, unreadMessages }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers } = useSocketContext();

    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = onlineUsers.includes(conversation._id);

    const handleClick = () => {
        setSelectedConversation(conversation);
        // Mark messages as read when conversation is selected
        if (unreadMessages > 0) {
            // Implement the logic to mark messages as read
            // This could involve calling an API or emitting a socket event
        }
    };

    return (
        <>
            <div
                className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
                ${isSelected ? "bg-sky-500" : ""}
                ${unreadMessages > 0 ? "bg-[#2B3440] dark:bg-green-100" : ""}
                transition-all duration-300 ease-in-out
                `}
                onClick={handleClick}
            >
                <div className={`avatar ${isOnline ? "online" : ""}`}>
                    <div className='w-12 rounded-full'>
                        <img src={conversation.profilePic} alt='user avatar' />
                    </div>
                </div>
                <div className='flex flex-col flex-1'>
                    <div className='flex gap-3 justify-between'>
                        <p className='font-bold text-gray-200'>{conversation.fullName}</p>
                        {unreadMessages > 0 && (
                            <span className='bg-green-500 text-white text-xs font-bold rounded-full px-2 py-1'>
                                {unreadMessages}
                            </span>
                        )}
                    </div>
                </div>
            </div>
            {!lastIdx && <div className='divider my-0 py-0 h-1' />}
        </>
    );
};

export default Conversation;