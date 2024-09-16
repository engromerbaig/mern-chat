import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversation from './Conversation';
import { useSocketContext } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';
import useConversation from '../../zustand/useConversation';  // Zustand for managing selected conversation

const Conversations = () => {
    const [loading, setLoading] = useState(true);
    const [groupedUsers, setGroupedUsers] = useState({});
    const { socket } = useSocketContext();
    const { _id: currentUserId } = useAuthContext();
    const { selectedConversation } = useConversation(); // Zustand for managing selected conversation

    useEffect(() => {
        const fetchGroupedUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    params: { currentUserId }
                });
                setGroupedUsers(response.data);
            } catch (error) {
                console.error("Error fetching grouped users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupedUsers();

        if (socket) {
            // Handle new message update for any conversation
            socket.on("updateSidebar", ({ senderId, receiverId, message }) => {
                const targetUserId = senderId === currentUserId ? receiverId : senderId;

                // Update conversations to make sure that we handle all of them
                setGroupedUsers((prevGroupedUsers) => {
                    const updatedGroupedUsers = { ...prevGroupedUsers };

                    // Loop over roles
                    for (const role in updatedGroupedUsers) {
                        const userIndex = updatedGroupedUsers[role].findIndex(
                            (user) => user._id === targetUserId
                        );

                        if (userIndex !== -1) {
                            const isConversationSelected = selectedConversation && selectedConversation._id === targetUserId;

                            // Clone user data and update their last message and unreadMessages
                            const updatedUser = {
                                ...updatedGroupedUsers[role][userIndex],
                                lastMessageTimestamp: message.createdAt,
                                unreadMessages: isConversationSelected 
                                    ? 0  // If the conversation is open, mark as read
                                    : (updatedGroupedUsers[role][userIndex].unreadMessages || 0) + 1,
                            };

                            // Move the updated user to the top of their role's list
                            const updatedRoleUsers = [...updatedGroupedUsers[role]];
                            updatedRoleUsers.splice(userIndex, 1); // Remove from old position
                            updatedRoleUsers.unshift(updatedUser);  // Move to top

                            updatedGroupedUsers[role] = updatedRoleUsers;
                            break;
                        }
                    }

                    return updatedGroupedUsers;
                });
            });

            // Handle marking messages as read
            socket.on("messageRead", ({ conversationId }) => {
                setGroupedUsers((prevGroupedUsers) => {
                    const updatedGroupedUsers = { ...prevGroupedUsers };

                    for (const role in updatedGroupedUsers) {
                        const userIndex = updatedGroupedUsers[role].findIndex(
                            (user) => user._id === conversationId
                        );

                        if (userIndex !== -1) {
                            const updatedUser = {
                                ...updatedGroupedUsers[role][userIndex],
                                unreadMessages: 0, // Reset unread messages
                            };

                            // Update role list
                            const updatedRoleUsers = [...updatedGroupedUsers[role]];
                            updatedRoleUsers[userIndex] = updatedUser;

                            updatedGroupedUsers[role] = updatedRoleUsers;
                            break;
                        }
                    }

                    return updatedGroupedUsers;
                });
            });
        }

        return () => {
            if (socket) {
                socket.off("updateSidebar");
                socket.off("messageRead");
            }
        };
    }, [currentUserId, socket, selectedConversation]);

    // Flatten users and sort them within their roles
    const sortedGroupedUsers = Object.keys(groupedUsers).reduce((acc, role) => {
        const sortedRoleUsers = [...groupedUsers[role]].sort((a, b) => {
            const aTimestamp = new Date(a.lastMessageTimestamp).getTime();
            const bTimestamp = new Date(b.lastMessageTimestamp).getTime();
            return bTimestamp - aTimestamp;
        });
        acc[role] = sortedRoleUsers;
        return acc;
    }, {});

    const roles = Object.keys(sortedGroupedUsers);

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {roles.map(role => (
                <div key={role}>
                    <div className='font-bold divider text-base text-white'>{role}</div>
                    {sortedGroupedUsers[role].map((user, idx) => (
                        <Conversation
                            key={user._id}
                            conversation={user}
                            lastIdx={idx === sortedGroupedUsers[role].length - 1}
                            unreadMessages={user.unreadMessages}
                        />
                    ))}
                </div>
            ))}
            {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
        </div>
    );
};

export default Conversations;
