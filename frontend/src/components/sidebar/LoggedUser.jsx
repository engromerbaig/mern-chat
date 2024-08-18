import { useAuthContext } from "../../context/AuthContext";
import { useSocketContext } from "../../context/SocketContext"; // Import SocketContext for online status
import { useEffect, useState } from "react";

// Function to format the login time in a 12-hour format
const formatTime = (dateString) => {
    const options = {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true, // 12-hour format
    };
    return new Intl.DateTimeFormat('en-US', options).format(new Date(dateString));
};

// Function to calculate session duration
const calculateSessionDuration = (loginTime) => {
    const now = new Date();
    const loginDate = new Date(loginTime);
    const diffInMs = now - loginDate;
    const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
    const hours = Math.floor(diffInMinutes / 60);
    const minutes = diffInMinutes % 60;

    if (hours > 0) {
        return `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    } else {
        return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
    }
};

const LoggedUser = () => {
    const { authUser } = useAuthContext();
    const { onlineUsers } = useSocketContext(); // Use SocketContext to get online users
    const [sessionDuration, setSessionDuration] = useState('');

    // Determine if the user is online
    const isOnline = onlineUsers.includes(authUser?._id);

    useEffect(() => {
        // Update session duration every minute
        const intervalId = setInterval(() => {
            if (authUser.loginTime) {
                setSessionDuration(calculateSessionDuration(authUser.loginTime));
            }
        }, 60000); // Update every minute

        // Initial calculation
        if (authUser.loginTime) {
            setSessionDuration(calculateSessionDuration(authUser.loginTime));
        }

        // Cleanup interval on component unmount
        return () => clearInterval(intervalId);
    }, [authUser.loginTime]);

    return (
        <div className="flex md:flex-col gap-4 bg-sky-500 p-4 rounded-md items-center">
            	<div className={`avatar ${isOnline ? "online" : ""}`}>
					<div className='w-12 rounded-full'>
						<img src={authUser.profilePic} alt='user avatar' />
					</div>
				</div>
            <div className="md:file:text-center">
                <h1 className="text-xl font-bold text-white">
                    {authUser.fullName}
                </h1>
                <p className="text-white text-xs font-bold">
                    Active Since: {authUser.loginTime ? formatTime(authUser.loginTime) : 'N/A'}
                </p>
                <p className="text-white text-xs">
                    Session Duration: {sessionDuration || 'Calculating...'}
                </p>
            </div>
        </div>
    );
};

export default LoggedUser;
