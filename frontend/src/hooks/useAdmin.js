// frontend/src/hooks/useAdmin.js
import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuthContext } from '../context/AuthContext';

export const useAdmin = () => {
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const { authUser } = useAuthContext();

  const fetchStats = useCallback(async () => {
    if (!authUser) return;
    try {
      const [pendingResponse, historyResponse] = await Promise.all([
        axios.get('/api/admin/pending-requests'),
        axios.get('/api/admin/request-history')
      ]);
      const pendingRequests = Array.isArray(pendingResponse.data) ? pendingResponse.data.length : 0;
      const { approvedRequests, rejectedRequests } = historyResponse.data;
      const acceptedRequests = Array.isArray(approvedRequests) ? approvedRequests.length : 0;
      const rejectedRequestsCount = Array.isArray(rejectedRequests) ? rejectedRequests.length : 0;
      const totalRequests = pendingRequests + acceptedRequests + rejectedRequestsCount;

      setStats({
        totalRequests,
        pendingRequests,
        acceptedRequests,
        rejectedRequests: rejectedRequestsCount,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [authUser]);

  const fetchPendingRequests = useCallback(async () => {
    if (!authUser) return;
    try {
      const response = await axios.get('/api/admin/pending-requests');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  }, [authUser]);

  useEffect(() => {
    if (authUser) {
      fetchStats();
      fetchPendingRequests();
    }
  }, [authUser, fetchStats, fetchPendingRequests]);

  return {
    stats,
    pendingRequests,
    fetchStats,
    fetchPendingRequests
  };
};
