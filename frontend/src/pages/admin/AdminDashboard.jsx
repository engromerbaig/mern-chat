import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../../components/sidebar/LogoutButton';

console.log("AdminDashboard.jsx");

const AdminDashboard = () => {
  const [pendingRequests, setPendingRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

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
    <div className="h-screen w-full bg-black flex flex-col">
      <div className="flex-grow overflow-auto bg-white p-6 m-4 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">Super Admin Dashboard</h1>
        <h2 className="text-2xl font-semibold mb-4 text-gray-700">Pending Role Requests</h2>
        {pendingRequests.length === 0 ? (
          <p className="text-gray-600 text-center">No pending requests.</p>
        ) : (
          // here goes the approve list
          <ul className=" grid grid-cols-3 gap-4 ">
            {pendingRequests.map((request) => (
              <li key={request._id} className="bg-gray-100   p-6 rounded-lg shadow-sm">
                <p className="text-xl mb-3 text-gray-800">
                  <strong>{request.fullName}</strong> ({request.username}) - {request.role}
                </p>
                <p className="text-gray-500 pb-3 text-sm">
                Requested at: {new Date(request.createdAt).toLocaleString()}
              </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => handleApprove(request._id)}
                    className="bg-green-500 text-white px-5 py-2 rounded-lg hover:bg-green-600 transition duration-300"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleReject(request._id)}
                    className="bg-red-500 text-white px-5 py-2 rounded-lg hover:bg-red-600 transition duration-300"
                  >
                    Reject
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
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