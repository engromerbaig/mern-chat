import React from 'react';
import { useSocketContext } from '../../context/SocketContext';
import useConversation from '../../zustand/useConversation';  // Zustand for managing selected conversation

const Conversation = ({ conversation, lastIdx, unreadMessages }) => {
    const { selectedConversation, setSelectedConversation } = useConversation();
    const { onlineUsers, socket } = useSocketContext();

    const isSelected = selectedConversation?._id === conversation._id;
    const isOnline = onlineUsers.includes(conversation._id);

    const handleClick = () => {
        setSelectedConversation(conversation);

        // If the conversation has unread messages, mark them as read
        if (unreadMessages > 0) {
            socket.emit('markMessageAsRead', {
                conversationId: conversation._id,
            });
        }
    };

    return (
        <>
            <div
                className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
                ${isSelected ? "bg-sky-500" : ""}
                ${unreadMessages > 0 && !isSelected ? "bg-[#2B3440] dark:bg-green-100" : ""}
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
                        {unreadMessages > 0 && !isSelected && (
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
