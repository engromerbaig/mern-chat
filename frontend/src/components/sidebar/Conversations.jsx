// components/Conversations.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversation from './Conversation';
import { useSocketContext } from '../../context/SocketContext';

const Conversations = () => {
    const [loading, setLoading] = useState(true);
    const [groupedUsers, setGroupedUsers] = useState({});
    const { onlineUsers } = useSocketContext();

    useEffect(() => {
        const fetchGroupedUsers = async () => {
            try {
                const response = await axios.get('/api/users');
                setGroupedUsers(response.data);
            } catch (error) {
                console.error("Error fetching grouped users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupedUsers();
    }, []);

    // Flatten the grouped users into a list for sorting
    const flattenedUsers = Object.keys(groupedUsers).reduce((acc, role) => {
        return [...acc, ...groupedUsers[role].map(user => ({ ...user, role }))];
    }, []);

    // Sort users with online users first
    const sortedUsers = flattenedUsers.sort((a, b) => {
        const isAOnline = onlineUsers.includes(a._id);
        const isBOnline = onlineUsers.includes(b._id);

        if (isAOnline && !isBOnline) return -1; // a should come before b
        if (!isAOnline && isBOnline) return 1;  // b should come before a
        return 0; // maintain original order if both are either online or offline
    });

    // Get distinct roles
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
                        />
                    ))}
                </div>
            ))}
            {loading ? <span className='loading loading-spinner mx-auto'></span> : null}
        </div>
    );
};

export default Conversations;
