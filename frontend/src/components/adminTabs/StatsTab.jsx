// frontend/src/components/adminTabs/StatsTab.jsx
import React, { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useSocketContext } from '../../context/SocketContext';

const boxStyle = "py-10 px-6 text-white  rounded-lg flex flex-col items-center justify-center space-y-2";

const StatsTab = () => {
  const { stats, onlineUsers, fetchStats } = useSocketContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    fetchStats(); // Fetch initial stats on component mount

    return () => {
      // Optionally clean up listeners if needed
    };
  }, [fetchStats]);

  const handleNavigation = (path) => {
    navigate(path, { state: { from: location.pathname } });
  };

  return (
    <div className="py-4 px-20">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => handleNavigation('/pending-requests')}
          className={`${boxStyle} bg-black`}
        >
          <p className="text-xl">Total Requests</p>
          <p className="text-3xl font-bold">{stats.totalRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/pending-requests')}
          className={`${boxStyle} bg-yellow-500 cursor-pointer`}
        >
          <p className="text-xl">Pending Requests</p>
          <p className="text-3xl font-bold">{stats.pendingRequests}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => handleNavigation('/accepted-requests')}
          className={`${boxStyle} bg-green-500 cursor-pointer`}
        >
          <p className="text-xl">Accepted Requests</p>
          <p className="text-3xl font-bold">{stats.acceptedRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/rejected-requests')}
          className={`${boxStyle} bg-red-500 cursor-pointer`}
        >
          <p className="text-xl">Rejected Requests</p>
          <p className="text-3xl font-bold">{stats.rejectedRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/online-now')}
          className={`${boxStyle} bg-gray-500`}
        >
          <p className="text-xl">Online Now</p>
          <p className="text-3xl font-bold">{onlineUsers.length - 1}</p> {/* Adjusting for current user */}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
