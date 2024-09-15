import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversation from './Conversation';
import { useSocketContext } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';

const Conversations = () => {
    const [loading, setLoading] = useState(true);
    const [groupedUsers, setGroupedUsers] = useState({});
    const { socket } = useSocketContext();
    const { _id: currentUserId } = useAuthContext();

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
            socket.on("updateSidebar", ({ senderId, receiverId, message }) => {
                setGroupedUsers((prevGroupedUsers) => {
                    const updatedGroupedUsers = { ...prevGroupedUsers };
                    const targetUserId = senderId === currentUserId ? receiverId : senderId;

                    for (const role in updatedGroupedUsers) {
                        const userIndex = updatedGroupedUsers[role].findIndex(
                            (user) => user._id === targetUserId
                        );

                        if (userIndex !== -1) {
                            const updatedUser = {
                                ...updatedGroupedUsers[role][userIndex],
                                lastMessageTimestamp: message.createdAt,
                                unreadMessages: (updatedGroupedUsers[role][userIndex].unreadMessages || 0) + 1,
                            };

                            updatedGroupedUsers[role].splice(userIndex, 1);
                            updatedGroupedUsers[role].unshift(updatedUser);
                            break;
                        }
                    }

                    return updatedGroupedUsers;
                });
            });

            socket.on("messageRead", ({ conversationId }) => {
                setGroupedUsers((prevGroupedUsers) => {
                    const updatedGroupedUsers = { ...prevGroupedUsers };

                    for (const role in updatedGroupedUsers) {
                        const userIndex = updatedGroupedUsers[role].findIndex(
                            (user) => user._id === conversationId
                        );

                        if (userIndex !== -1) {
                            updatedGroupedUsers[role][userIndex].unreadMessages = 0;
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
    }, [currentUserId, socket]);

    const flattenedUsers = Object.keys(groupedUsers).reduce((acc, role) => {
        return [...acc, ...groupedUsers[role].map(user => ({ ...user, role }))];
    }, []);

    const sortedUsers = flattenedUsers.sort((a, b) => {
        const aTimestamp = new Date(a.lastMessageTimestamp).getTime();
        const bTimestamp = new Date(b.lastMessageTimestamp).getTime();
        return bTimestamp - aTimestamp;
    });

    const roles = Object.keys(groupedUsers);

    return (
        <div className='py-2 flex flex-col overflow-auto'>
            {roles.map(role => (
                <div key={role}>
                    <div className='font-bold divider text-base text-white'>{role}</div>
                    {sortedUsers.filter(user => user.role === role).map((user, idx) => (
                        <Conversation
                            key={user._id}
                            conversation={user}
                            lastIdx={idx === sortedUsers.filter(u => u.role === role).length - 1}
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