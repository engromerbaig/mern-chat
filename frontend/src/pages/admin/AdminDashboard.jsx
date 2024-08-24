// frontend/src/pages/admin/AdminDashboard.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LogoutButton from '../../components/sidebar/LogoutButton';
import StatsTab from '../../components/adminTabs/StatsTab';
import PendingRequestsTab from '../../components/adminTabs/PendingRequestsTab';
import AcceptedRequestsTab from '../../components/adminTabs/AcceptedRequestsTab';
import RejectedRequestsTab from '../../components/adminTabs/RejectedRequestsTab';
import { useSocketContext } from '../../context/SocketContext';

const AdminDashboard = () => {
  const { pendingRequests, fetchPendingRequests } = useSocketContext();
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        await fetchPendingRequests();
        await fetchRequestHistory();
        setLoading(false);
      } catch (err) {
        setError('Failed to load requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, [fetchPendingRequests]);

  const fetchRequestHistory = async () => {
    try {
      const response = await axios.get('/api/admin/request-history');
      const data = response.data;
      setAcceptedRequests(data.approvedRequests);
      setRejectedRequests(data.rejectedRequests);
    } catch (error) {
      console.error('Error fetching request history:', error);
      setError('Failed to fetch request history');
    }
  };

  const handleApprove = async (userId) => {
    try {
      await axios.post(`/api/admin/approve-role/${userId}`);
      await fetchPendingRequests();
      await fetchRequestHistory();
    } catch (err) {
      setError('Failed to approve role request');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(`/api/admin/reject-role/${userId}`);
      await fetchPendingRequests();
      await fetchRequestHistory();
    } catch (err) {
      setError('Failed to reject role request');
    }
  };

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  return (
    <div className="h-screen w-full bg-black flex flex-col">
      <div className="flex-grow overflow-auto bg-white p-6 m-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Super Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex justify-center gap-4 mb-6">
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 rounded-lg ${activeTab === 'stats' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Stats
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-6 py-3 rounded-lg ${activeTab === 'pending' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Pending Requests
          </button>
          <button
            onClick={() => setActiveTab('accepted')}
            className={`px-6 py-3 rounded-lg ${activeTab === 'accepted' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Accepted Requests
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-6 py-3 rounded-lg ${activeTab === 'rejected' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
          >
            Rejected Requests
          </button>
        </div>

        {/* Tab Content */}
        <div>
          {activeTab === 'stats' && <StatsTab />}
          {activeTab === 'pending' && (
            <PendingRequestsTab
              pendingRequests={pendingRequests}
              handleApprove={handleApprove}
              handleReject={handleReject}
            />
          )}
          {activeTab === 'accepted' && <AcceptedRequestsTab acceptedRequests={acceptedRequests} />}
          {activeTab === 'rejected' && <RejectedRequestsTab rejectedRequests={rejectedRequests} />}
        </div>
      </div>

      {/* Bottom section */}
      <div className="h-10 p-12 bg-black flex justify-between items-center px-6">
        <LogoutButton />
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300"
        >
          Proceed to Chat
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;