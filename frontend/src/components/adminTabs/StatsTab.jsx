import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { useSocketContext } from '../../context/SocketContext'; // Import the hook

// Define box styling
const boxStyle = "py-10 px-6 text-white cursor-pointer rounded-lg flex flex-col items-center justify-center space-y-2";

const StatsTab = () => {
  // State to store stats
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0,
  });

  // State to store online users
  const [onlineUserCount, setOnlineUserCount] = useState(0);

  // Hook to handle navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Fetch online users from the context
  const { onlineUsers } = useSocketContext();

  // Function to handle tab navigation
  const handleNavigation = (path) => {
    navigate(path, { state: { from: location.pathname } });
  };

  // Function to fetch data from APIs
  const fetchData = async () => {
    try {
      // Fetch pending requests
      const pendingResponse = await axios.get('/api/admin/pending-requests');
      const pendingRequests = Array.isArray(pendingResponse.data) ? pendingResponse.data.length : 0;

      // Fetch request history
      const historyResponse = await axios.get('/api/admin/request-history');
      const { approvedRequests, rejectedRequests } = historyResponse.data;
      const acceptedRequests = Array.isArray(approvedRequests) ? approvedRequests.length : 0;
      const rejectedRequestsCount = Array.isArray(rejectedRequests) ? rejectedRequests.length : 0;

      // Calculate total requests
      const totalRequests = pendingRequests + acceptedRequests + rejectedRequestsCount;

      // Update state with fetched data
      setStats({
        totalRequests,
        pendingRequests,
        acceptedRequests,
        rejectedRequests: rejectedRequestsCount,
      });

      // Update online user count
      setOnlineUserCount(onlineUsers.length);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    fetchData();
  }, [onlineUsers]); // Depend on onlineUsers to update when it changes

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
          className={`${boxStyle} bg-yellow-500`}
        >
          <p className="text-xl">Pending Requests</p>
          <p className="text-3xl font-bold">{stats.pendingRequests}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => handleNavigation('/accepted-requests')}
          className={`${boxStyle} bg-green-500`}
        >
          <p className="text-xl">Accepted Requests</p>
          <p className="text-3xl font-bold">{stats.acceptedRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/rejected-requests')}
          className={`${boxStyle} bg-red-500`}
        >
          <p className="text-xl">Rejected Requests</p>
          <p className="text-3xl font-bold">{stats.rejectedRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/online-now')}
          className={`${boxStyle} bg-gray-500`}
        >
          <p className="text-xl">Online Now</p>
          <p className="text-3xl font-bold">{onlineUserCount-1}</p> {/* Display the count of online users */}
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
