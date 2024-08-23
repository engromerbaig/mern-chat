// frontend/src/context/SocketContext.jsx
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

      socket.on("requestStatusChange", () => {
        fetchStats(); // Update stats when an event is received
      });

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
      const pendingResponse = await axios.get('/api/admin/pending-requests');
      const pendingRequests = Array.isArray(pendingResponse.data) ? pendingResponse.data.length : 0;

      const historyResponse = await axios.get('/api/admin/request-history');
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

  return (
    <SocketContext.Provider value={{ socket, onlineUsers, stats, fetchStats }}>
      {children}
    </SocketContext.Provider>
  );
};
