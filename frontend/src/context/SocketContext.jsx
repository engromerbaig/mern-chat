import { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";
import axios from 'axios';

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [stats, setStats] = useState({
    totalRequests: 0,
    pendingRequests: 0,
    acceptedRequests: 0,
    rejectedRequests: 0,
  });
  const [pendingRequests, setPendingRequests] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000/", {
        query: {
          userId: authUser._id,
        },
      });
      setSocket(socket);

      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socket.on("requestStatusChange", (changeType) => {
        if (changeType === 'new') {
          setStats(prevStats => ({
            ...prevStats,
            totalRequests: prevStats.totalRequests + 1,
            pendingRequests: prevStats.pendingRequests + 1
          }));
        } else if (changeType === 'accepted' || changeType === 'rejected') {
          setStats(prevStats => ({
            ...prevStats,
            pendingRequests: prevStats.pendingRequests - 1,
            [changeType === 'accepted' ? 'acceptedRequests' : 'rejectedRequests']: 
              prevStats[changeType === 'accepted' ? 'acceptedRequests' : 'rejectedRequests'] + 1
          }));
        }
        fetchPendingRequests();
      });

      // Initial fetch of stats and pending requests
      fetchStats();
      fetchPendingRequests();

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  const fetchStats = async () => {
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
  };

  const fetchPendingRequests = async () => {
    try {
      const response = await axios.get('/api/admin/pending-requests');
      setPendingRequests(response.data);
    } catch (error) {
      console.error('Error fetching pending requests:', error);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, stats, fetchStats, pendingRequests, fetchPendingRequests }}>
      {children}
    </SocketContext.Provider>
  );
};