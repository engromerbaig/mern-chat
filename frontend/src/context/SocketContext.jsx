// frontend/src/context/SocketContext.js
import React, { createContext, useState, useEffect, useContext } from "react";
import { useAuthContext } from "./AuthContext";
import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [conversations, setConversations] = useState([]);
  const { authUser } = useAuthContext();

  useEffect(() => {
    let socketInstance = null;

    if (authUser) {
      socketInstance = io("http://localhost:5000/", {
        query: { userId: authUser._id },
      });

      setSocket(socketInstance);

      socketInstance.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      socketInstance.on("updateSidebar", ({ senderId, receiverId, message }) => {
        setConversations((prevConversations) => {
          const updatedConversations = [...prevConversations];
          const conversationIndex = updatedConversations.findIndex(
            (conv) =>
              Array.isArray(conv?.participants) &&
              conv.participants.includes(senderId) &&
              conv.participants.includes(receiverId)
          );

          if (conversationIndex !== -1) {
            // Update existing conversation
            const updatedConv = {
              ...updatedConversations[conversationIndex],
              lastMessage: message,
              lastMessageTimestamp: message.createdAt,
              unreadCount:
                authUser._id !== senderId
                  ? (updatedConversations[conversationIndex].unreadCount || 0) + 1
                  : 0,
            };
            updatedConversations.splice(conversationIndex, 1);
            updatedConversations.unshift(updatedConv);
          } else {
            // Create a new conversation
            updatedConversations.unshift({
              participants: [senderId, receiverId],
              lastMessage: message,
              lastMessageTimestamp: message.createdAt,
              unreadCount: authUser._id !== senderId ? 1 : 0,
            });
          }

          return updatedConversations;
        });
      });

      socketInstance.on("messageRead", ({ conversationId }) => {
        setConversations((prevConversations) =>
          prevConversations.map((conv) =>
            conv._id === conversationId ? { ...conv, unreadCount: 0 } : conv
          )
        );
      });

      return () => {
        if (socketInstance) {
          socketInstance.disconnect();
        }
      };
    }
  }, [authUser]);

  const contextValue = {
    socket,
    onlineUsers,
    conversations,
    setConversations,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};
