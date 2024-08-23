import React, { useEffect, useState } from 'react';
import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext";
import { extractTime, formatDateAndTime } from '../../utils/extractTime';

const calculateSessionDuration = (loginTime) => {
    const now = new Date();
    const loginDate = new Date(loginTime);
    const diffInMs = now - loginDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    } else {
        return `${minutes}m`;
    }
};

const LoggedUser = () => {
    const { authUser } = useAuthContext();
    const { onlineUsers } = useSocketContext();
    const [sessionDuration, setSessionDuration] = useState('');

    const isOnline = onlineUsers.includes(authUser?._id);

    useEffect(() => {
        const updateSessionDuration = () => {
            if (authUser.loginTime) {
                setSessionDuration(calculateSessionDuration(authUser.loginTime));
            }
        };

        updateSessionDuration(); // Initial calculation
        const intervalId = setInterval(updateSessionDuration, 60000); // Update every minute

        return () => clearInterval(intervalId);
    }, [authUser.loginTime]);

    return (
        <div className="flex md:flex-col gap-4 bg-sky-500 p-4 rounded-md items-center">
            <div className={`avatar ${isOnline ? "online" : ""}`}>
                <div className='w-12 rounded-full'>
                    <img src={authUser.profilePic} alt='user avatar' />
                </div>
            </div>
            <div className="md:text-center">

                <h1 className="text-xl font-bold text-white">{authUser.fullName}</h1>
                <h1 className=" font-bold text-white text-sm">Role: {authUser.role}</h1>

                <p className="text-white text-xs font-bold">
                    Active Since: {authUser.loginTime ? extractTime(authUser.loginTime) : 'N/A'}
                </p>
                <p className="text-white text-xs">
                    Session: {sessionDuration || 'Calculating...'}
                </p>
                <p className="text-white text-xs">
                    Login: {authUser.loginTime ? formatDateAndTime(authUser.loginTime) : 'N/A'}
                </p>
            </div>
        </div>
    );
};

export default LoggedUser;