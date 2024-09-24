import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversation from './Conversation';
import { useSocketContext } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';
import useConversation from '../../zustand/useConversation';

const Conversations = () => {
    const [loading, setLoading] = useState(true);
    const [groupedUsers, setGroupedUsers] = useState({}); // Grouped users by role
    const { socket } = useSocketContext();
    const { _id: currentUserId } = useAuthContext();
    const { selectedConversation } = useConversation();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    params: { currentUserId }
                });

                if (response.data && typeof response.data === 'object') {
                    setGroupedUsers(response.data); // Set grouped users
                } else {
                    console.error("Unexpected API response format");
                }
            } catch (error) {
                console.error("Error fetching users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();

        if (socket) {
            socket.on("updateSidebar", ({ senderId, receiverId, message }) => {
                const targetUserId = senderId === currentUserId ? receiverId : senderId;

                setGroupedUsers((prevGroupedUsers) => {
                    const updatedGroupedUsers = { ...prevGroupedUsers };

                    // Loop through roles and update the relevant user
                    for (const role in updatedGroupedUsers) {
                        const userIndex = updatedGroupedUsers[role].findIndex(
                            (user) => user._id === targetUserId
                        );

                        if (userIndex !== -1) {
                            const isConversationSelected = selectedConversation && selectedConversation._id === targetUserId;

                            const updatedUser = {
                                ...updatedGroupedUsers[role][userIndex],
                                lastMessageTimestamp: message.createdAt,
                                unreadMessages: isConversationSelected 
                                    ? 0  
                                    : (updatedGroupedUsers[role][userIndex].unreadMessages || 0) + 1,
                            };

                            // Remove user from the list and move to the top of their respective role's list
                            updatedGroupedUsers[role].splice(userIndex, 1);
                            updatedGroupedUsers[role].unshift(updatedUser);

                            // Re-sort the users within their role based on the latest message
                            updatedGroupedUsers[role] = updatedGroupedUsers[role].sort((a, b) => {
                                const aTimestamp = new Date(a.lastMessageTimestamp).getTime();
                                const bTimestamp = new Date(b.lastMessageTimestamp).getTime();
                                return bTimestamp - aTimestamp;
                            });

                            break;
                        }
                    }

                    return updatedGroupedUsers;
                });
            });

            socket.on("messageRead", ({ conversationId }) => {
                setGroupedUsers((prevGroupedUsers) => {
                    const updatedGroupedUsers = { ...prevGroupedUsers };
            
                    // Loop through roles and find the relevant user
                    for (const role in updatedGroupedUsers) {
                        const userIndex = updatedGroupedUsers[role].findIndex(
                            (user) => user._id === conversationId
                        );
            
                        if (userIndex !== -1) {
                            const updatedUser = {
                                ...updatedGroupedUsers[role][userIndex],
                                unreadMessages: 0,  // Reset unread messages to 0
                            };
            
                            updatedGroupedUsers[role][userIndex] = updatedUser;
            
                            // Optional: Move user to the top of their role's list if desired
                            updatedGroupedUsers[role].splice(userIndex, 1);
                            updatedGroupedUsers[role].unshift(updatedUser);
            
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

    const roles = Object.keys(groupedUsers);

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {roles.map(role => (
                <div key={role}>
                    {/* Role will appear for each section of grouped users */}
                    {groupedUsers[role].map((user, idx) => (
                        <React.Fragment key={user._id}>
                            {idx === 0 && <div className='font-bold divider text-base text-white'>{role}</div>}
                            <Conversation
                                key={user._id}
                                conversation={user}
                                lastIdx={idx === groupedUsers[role].length - 1}
                                unreadMessages={user.unreadMessages}
                            />
                        </React.Fragment>
                    ))}
                </div>
            ))}
            {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
        </div>
    );
};

export default Conversations;
