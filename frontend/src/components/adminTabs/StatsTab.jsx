//  frontend\src\components\adminTabs\StatsTab.jsx
import React, { useEffect } from 'react';
import { useSocketContext } from '../../context/SocketContext';

const boxStyle = "py-10 px-6 text-white rounded-lg flex flex-col items-center justify-center space-y-2";

const StatsTab = ({ onTabChange }) => {
  const { stats, onlineUsers, fetchStats } = useSocketContext();

  useEffect(() => {
    fetchStats(); // Fetch initial stats on component mount

    return () => {
      // Optionally clean up listeners if needed
    };
  }, [fetchStats]);

  return (
    <div className="py-4 px-20">
      {/* Tabs for different stats */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          className={`${boxStyle} bg-black`}
        >
          <p className="text-xl">Total Requests</p>
          <p className="text-3xl font-bold">{stats.totalRequests}</p>
        </div>
        <div
          onClick={() => onTabChange('pending')}
          className={`${boxStyle} bg-yellow-500 cursor-pointer`}
        >
          <p className="text-xl">Pending Requests</p>
          <p className="text-3xl font-bold">{stats.pendingRequests}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => onTabChange('accepted')}
          className={`${boxStyle} bg-green-500 cursor-pointer`}
        >
          <p className="text-xl">Accepted Requests</p>
          <p className="text-3xl font-bold">{stats.acceptedRequests}</p>
        </div>
        <div
          onClick={() => onTabChange('rejected')}
          className={`${boxStyle} bg-red-500 cursor-pointer`}
        >
          <p className="text-xl">Rejected Requests</p>
          <p className="text-3xl font-bold">{stats.rejectedRequests}</p>
        </div>
        <div
          className={`${boxStyle} bg-gray-500`}
        >
          <p className="text-xl">Online Now</p>
          <p className="text-3xl font-bold">{onlineUsers.length - 1}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
