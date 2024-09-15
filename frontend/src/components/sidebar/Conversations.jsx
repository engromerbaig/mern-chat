import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Conversation from './Conversation';
import { useSocketContext } from '../../context/SocketContext';
import { useAuthContext } from '../../context/AuthContext';

const Conversations = () => {
    const [loading, setLoading] = useState(true);
    const [groupedUsers, setGroupedUsers] = useState({});
    const { _id: currentUserId } = useAuthContext(); // Get the current user's ID

    useEffect(() => {
        const fetchGroupedUsers = async () => {
            try {
                const response = await axios.get('/api/users', {
                    params: { currentUserId } // Send the current user ID as a query parameter
                });
                setGroupedUsers(response.data);
            } catch (error) {
                console.error("Error fetching grouped users", error);
            } finally {
                setLoading(false);
            }
        };

        fetchGroupedUsers();
    }, [currentUserId]);

    // Flatten the grouped users into a list for sorting
    const flattenedUsers = Object.keys(groupedUsers).reduce((acc, role) => {
        return [...acc, ...groupedUsers[role].map(user => ({ ...user, role }))];
    }, []);

    // Sort users by most recent message timestamp
    const sortedUsers = flattenedUsers.sort((a, b) => {
        const aTimestamp = new Date(a.lastMessageTimestamp).getTime();
        const bTimestamp = new Date(b.lastMessageTimestamp).getTime();
        return bTimestamp - aTimestamp; // Sort in descending order (most recent first)
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
