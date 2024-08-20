import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/sidebar/LogoutButton';

console.log("AdminDashboard.jsx");

const AdminDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Hook for navigation

  useEffect(() => {
    const fetchPendingRequests = async () => {
      try {
        const response = await axios.get('/api/admin/pending-requests');
        setPendingRequests(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load pending requests');
        setLoading(false);
      }
    };

    fetchPendingRequests();
  }, []);

  const handleApprove = async (userId) => {
    try {
      await axios.post(`/api/admin/approve-role/${userId}`);
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== userId)
      );
    } catch (err) {
      setError('Failed to approve role request');
    }
  };

  const handleReject = async (userId) => {
    try {
      await axios.post(`/api/admin/reject-role/${userId}`);
      setPendingRequests((prevRequests) =>
        prevRequests.filter((request) => request._id !== userId)
      );
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
    <div className="h-screen w-full bg-black  p-10 flex flex-col">
      <div className="bg-white shadow-md rounded-lg p-6 mb-8 flex-1">
        <h1 className="text-2xl font-bold mb-4 text-center">Super Admin Dashboard</h1>
        <h2 className="text-xl font-semibold mb-4">Pending Role Requests</h2>
        {pendingRequests.length === 0 ? (
          <p>No pending requests.</p>
        ) : (
          <ul className="space-y-4">
            {pendingRequests.map((request) => (
              <li key={request._id} className="bg-gray-200 p-4 rounded-lg shadow-sm">
                <p className="text-lg mb-2">
                  <strong>{request.fullName}</strong> ({request.username}) - {request.role}
                </p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex justify-between">
        <LogoutButton /> {/* Use the LogoutButton component */}
        <button
          onClick={() => navigate('/')}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Proceed to Chat
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
