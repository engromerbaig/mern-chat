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

    const reorderGroupsByMostRecent = (groupedUsers) => {
        // Flatten all the users into a single array
        const allUsers = Object.values(groupedUsers).flat();
    
        // Sort all users by the latest message timestamp (descending order)
        allUsers.sort((a, b) => {
            const aTimestamp = new Date(a.lastMessageTimestamp).getTime();
            const bTimestamp = new Date(b.lastMessageTimestamp).getTime();
            return bTimestamp - aTimestamp;
        });
    
        // Rebuild groupedUsers based on the sorted users
        const newGroupedUsers = {};
    
        allUsers.forEach((user) => {
            if (!newGroupedUsers[user.role]) {
                newGroupedUsers[user.role] = [];
            }
            newGroupedUsers[user.role].push(user);
        });
    
        return newGroupedUsers;
    };
    

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
                    let updatedUser = null;
    
                    // Update user within their role
                    for (const role in updatedGroupedUsers) {
                        const userIndex = updatedGroupedUsers[role].findIndex(
                            (user) => user._id === targetUserId
                        );
    
                        if (userIndex !== -1) {
                            const isConversationSelected =
                                selectedConversation && selectedConversation._id === targetUserId;
    
                            updatedUser = {
                                ...updatedGroupedUsers[role][userIndex],
                                lastMessageTimestamp: message.createdAt,
                                unreadMessages: isConversationSelected
                                    ? 0
                                    : (updatedGroupedUsers[role][userIndex].unreadMessages || 0) + 1,
                            };
    
                            // Remove the user from the current role group
                            updatedGroupedUsers[role].splice(userIndex, 1);
    
                            break; // Stop once we've found and updated the user
                        }
                    }
    
                    // Add the updated user back to the top of their respective role group
                    if (updatedUser) {
                        const userRole = updatedUser.role;
    
                        if (!updatedGroupedUsers[userRole]) {
                            updatedGroupedUsers[userRole] = [];
                        }
    
                        updatedGroupedUsers[userRole].unshift(updatedUser);
    
                        // After updating the specific role group, re-sort all role groups based on most recent message
                        return reorderGroupsByMostRecent(updatedGroupedUsers);
                    }
    
                    return prevGroupedUsers; // Return the previous state if nothing was updated
                });
            });
    
            socket.on("messageRead", ({ conversationId }) => {
                // Handle messageRead event similarly
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
