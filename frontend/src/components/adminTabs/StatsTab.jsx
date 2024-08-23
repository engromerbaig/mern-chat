import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useNavigate and useLocation

// Define box styling
const boxStyle = " py-10 px-6 text-white cursor-pointer rounded-lg flex flex-col items-center justify-center space-y-2";

const StatsTab = () => {
  // Sample data for demonstration purposes
  const stats = {
    totalRequests: 123,
    pendingRequests: 45,
    acceptedRequests: 67,
    rejectedRequests: 12,
    onlineNow: 89,
  };

  // Hook to handle navigation
  const navigate = useNavigate();
  const location = useLocation();

  // Function to handle tab navigation
  const handleNavigation = (path) => {
    // This will update the URL without reloading the page
    navigate(path, { state: { from: location.pathname } });
  };

  return (
    <div className="py-4 px-20">
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div
          onClick={() => handleNavigation('/pending-requests')} // Link to pending requests tab
          className={`${boxStyle} bg-black `}
        >
          <p className="text-xl">Total Requests</p>
          <p className="text-3xl font-bold">{stats.totalRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/total-requests')} // Link to total requests tab
          className={`${boxStyle} bg-yellow-500`}
        >
          <p className="text-xl">Pending Requests</p>
          <p className="text-3xl font-bold">{stats.pendingRequests}</p>
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div
          onClick={() => handleNavigation('/accepted-requests')} // Link to accepted requests tab
          className={`${boxStyle} bg-green-500 `}
        >
          <p className="text-xl">Accepted Requests</p>
          <p className="text-3xl font-bold">{stats.acceptedRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/rejected-requests')} // Link to rejected requests tab
          className={`${boxStyle} bg-red-500 `}
        >
          <p className="text-xl">Rejected Requests</p>
          <p className="text-3xl font-bold">{stats.rejectedRequests}</p>
        </div>
        <div
          onClick={() => handleNavigation('/online-now')} // Link to online now tab
          className={`${boxStyle} bg-green-500 `}
        >
          <p className="text-xl">Online Now</p>
          <p className="text-3xl font-bold">{stats.onlineNow}</p>
        </div>
      </div>
    </div>
  );
};

export default StatsTab;
