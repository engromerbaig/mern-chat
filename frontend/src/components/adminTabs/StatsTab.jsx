// frontend/src/components/adminTabs/StatsTab.jsx
import React, { useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin'; // Import the useAdmin hook
import { useSocketContext } from '../../context/SocketContext'; // To get online users

const boxStyle = "py-10 px-6 text-white rounded-lg flex flex-col items-center justify-center space-y-2";

const StatsTab = () => {
  const { stats, fetchStats } = useAdmin(); // Get stats from useAdmin hook
  const { onlineUsers } = useSocketContext(); // Get online users from SocketContext

  useEffect(() => {
    fetchStats(); // Fetch stats when component mounts
  }, [fetchStats]);

  return (
    <div className="py-4 md:px-20">
      {/* Display the statistics in boxes */}
      <div className="grid md:grid-cols-2 gap-4 mb-6">
        <div className={`${boxStyle} bg-black`}>
          <p className="text-xl">Total Requests</p>
          <p className="text-3xl font-bold">{stats.totalRequests}</p>
        </div>
        <div className={`${boxStyle} bg-yellow-500`}>
          <p className="text-xl">Pending Requests</p>
          <p className="text-3xl font-bold">{stats.pendingRequests}</p>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className={`${boxStyle} bg-green-500`}>
          <p className="text-xl">Accepted Requests</p>
          <p className="text-3xl font-bold">{stats.acceptedRequests}</p>
        </div>
        <div className={`${boxStyle} bg-red-500`}>
          <p className="text-xl">Rejected Requests</p>
          <p className="text-3xl font-bold">{stats.rejectedRequests}</p>
        </div>
        <div className={`${boxStyle} bg-gray-500`}>
          <p className="text-xl">Online Now</p>
          <p className="text-3xl font-bold">{onlineUsers.length - 1}</p> {/* Minus 1 to exclude the admin */}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
