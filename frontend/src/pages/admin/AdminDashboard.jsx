import React, { useEffect, useState, useCallback, lazy, Suspense } from 'react';
import axios from 'axios';
import LogoutButton from '../../components/sidebar/LogoutButton';
import { useNavigate } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';

const StatsTab = lazy(() => import('../../components/adminTabs/StatsTab'));
const PendingRequestsTab = lazy(() => import('../../components/adminTabs/PendingRequestsTab'));
const AcceptedRequestsTab = lazy(() => import('../../components/adminTabs/AcceptedRequestsTab'));
const RejectedRequestsTab = lazy(() => import('../../components/adminTabs/RejectedRequestsTab'));

const AdminDashboard = () => {
  const { pendingRequests, fetchPendingRequests } = useAdmin();
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('stats');
  const navigate = useNavigate();

  const fetchRequestHistory = useCallback(async () => {
    try {
      const response = await axios.get('/api/admin/request-history');
      const data = response.data;
      setAcceptedRequests(data.approvedRequests || []);
      setRejectedRequests(data.rejectedRequests || []);
    } catch (error) {
      console.error('Error fetching request history:', error);
      setError('Failed to fetch request history');
    }
  }, []);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        await Promise.all([fetchPendingRequests(), fetchRequestHistory()]);
        setLoading(false);
      } catch (err) {
        setError('Failed to load requests');
        setLoading(false);
      }
    };

    fetchRequests();
  }, [fetchPendingRequests, fetchRequestHistory]);

  const handleApprove = useCallback(async (userId) => {
    try {
      await axios.post(`/api/admin/approve-role/${userId}`);
      await fetchPendingRequests();
      await fetchRequestHistory();
    } catch (err) {
      setError('Failed to approve role request');
    }
  }, [fetchPendingRequests, fetchRequestHistory]);

  const handleReject = useCallback(async (userId) => {
    try {
      await axios.post(`/api/admin/reject-role/${userId}`);
      await fetchPendingRequests();
      await fetchRequestHistory();
    } catch (err) {
      setError('Failed to reject role request');
    }
  }, [fetchPendingRequests, fetchRequestHistory]);

  if (loading) {
    return <div className="text-center text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-600">{error}</div>;
  }

  const tabContent = {
    stats: <StatsTab />,
    pending: (
      <PendingRequestsTab
        pendingRequests={pendingRequests}
        handleApprove={handleApprove}
        handleReject={handleReject}
      />
    ),
    accepted: <AcceptedRequestsTab acceptedRequests={acceptedRequests} />,
    rejected: <RejectedRequestsTab rejectedRequests={rejectedRequests} />,
  };

  return (
    <div className="h-screen w-full bg-black flex flex-col">
      <div className="flex-grow overflow-hidden bg-white p-6 m-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Super Admin Dashboard</h1>

        <div className="flex flex-col sm:flex-row h-full">
          {/* Tab navigation buttons */}
          <div className="sm:w-1/3 mb-4 sm:mb-0 sm:pr-4">
            <div className="flex sm:flex-col justify-center sm:justify-start gap-2 sm:gap-4">
              {['stats', 'pending', 'accepted', 'rejected'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 sm:py-3 rounded-lg text-sm sm:text-base w-full ${
                    activeTab === tab ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)} Requests
                </button>
              ))}
            </div>
          </div>

          {/* Tab content */}
          <div className="sm:w-2/3 overflow-auto">
            <Suspense fallback={<div className="text-center text-gray-600">Loading...</div>}>
              {tabContent[activeTab]}
            </Suspense>
          </div>
        </div>
      </div>

      {/* Bottom section with logout button */}
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