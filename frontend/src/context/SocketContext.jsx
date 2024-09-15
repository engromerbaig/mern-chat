import React, { createContext, useState, useEffect, useContext, useCallback } from "react";
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
  const [conversations, setConversations] = useState([]);
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

  const fetchConversations = useCallback(async () => {
    if (!authUser) return;
    try {
      const response = await axios.get('/api/conversations');
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
    }
  }, [authUser]);

  useEffect(() => {
    let socketInstance = null;

    if (authUser) {
      socketInstance = io("http://localhost:5000/", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on("requestStatusChange", (changeType) => {
        setStats(prevStats => {
          let newStats = { ...prevStats };
          if (changeType === 'new') {
            newStats.totalRequests++;
            newStats.pendingRequests++;
          } else if (changeType === 'accepted' || changeType === 'rejected') {
            newStats.pendingRequests--;
            newStats[changeType === 'accepted' ? 'acceptedRequests' : 'rejectedRequests']++;
          }
          return newStats;
        });
        fetchPendingRequests();
      });

      socketInstance.on("updateSidebar", ({ senderId, receiverId, message }) => {
        setConversations(prevConversations => {
          const updatedConversations = [...prevConversations];
          const conversationIndex = updatedConversations.findIndex(
            conv => {
              return Array.isArray(conv?.participants) &&
                     conv.participants.includes(senderId) &&
                     conv.participants.includes(receiverId);
            }
          );

          if (conversationIndex !== -1) {
            // Update existing conversation
            const updatedConv = {
              ...updatedConversations[conversationIndex],
              lastMessage: message,
              lastMessageTimestamp: message.createdAt,
              unreadCount: authUser._id !== senderId 
                ? (updatedConversations[conversationIndex].unreadCount || 0) + 1 
                : 0
            };
            updatedConversations.splice(conversationIndex, 1);
            updatedConversations.unshift(updatedConv);
          } else {
            // Create a new conversation
            updatedConversations.unshift({
              participants: [senderId, receiverId],
              lastMessage: message,
              lastMessageTimestamp: message.createdAt,
              unreadCount: authUser._id !== senderId ? 1 : 0
            });
          }

          return updatedConversations;
        });
      });

      socketInstance.on("messageRead", ({ conversationId, messageId }) => {
        setConversations(prevConversations => 
          prevConversations.map(conv => 
            conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      });

      // Initial fetch of stats, pending requests, and conversations
      fetchStats();
      fetchPendingRequests();
      fetchConversations();
    }

    return () => {
      if (socketInstance) {
        socketInstance.disconnect();
      }
    };
  }, [authUser, fetchStats, fetchPendingRequests, fetchConversations]);

  const contextValue = {
    socket,
    onlineUsers,
    stats,
    fetchStats,
    pendingRequests,
    fetchPendingRequests,
    conversations,
    setConversations
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};