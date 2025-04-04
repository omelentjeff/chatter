import React, { createContext, useContext, useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthProvider";
import { set } from "lodash";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const baseUrl = `${import.meta.env.VITE_API_URL}`;
  const { userId, token } = useAuth();
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newChats, setNewChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [typingChats, setTypingChats] = useState({});

  useEffect(() => {
    if (userId && token) {
      const socket = new SockJS("http://localhost:8080/ws");
      const client = over(socket);

      client.connect(
        {},
        () => {
          setConnected(true);
          console.log("WebSocket connected");

          // Subscribe to the new user's queue
          client.subscribe(`/user/${userId}/queue/messages`, (payload) => {
            const message = JSON.parse(payload.body);
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log("Received message:", message);
          });

          client.subscribe(`/user/${userId}/queue/new-chat`, (payload) => {
            const newChat = JSON.parse(payload.body);
            console.log("New chat received:", newChat);

            setNewChats((prevChats) => [...prevChats, newChat]);
          });

          client.subscribe(`/user/${userId}/queue/is-typing`, (payload) => {
            const message = JSON.parse(payload.body);
            console.log("Received is-typing message:", message);

            setTypingChats((prevTypingChats) => ({
              ...prevTypingChats,
              [message.chatId]: message.isTyping,
            }));
          });
        },

        (error) => {
          console.error("WebSocket error:", error);
          setConnected(false);
        }
      );

      setStompClient(client);

      // Cleanup previous WebSocket client
      return () => {
        if (client.connected) {
          client.disconnect(() => {
            console.log("WebSocket disconnected");
          });
        }
        setMessages([]);
        setConnected(false);
      };
    }
  }, [userId, token]);

  const resetWebSocketState = () => {
    if (stompClient && connected) {
      stompClient.disconnect(() => {
        console.log("WebSocket disconnected on reset");
      });
    }
    setStompClient(null);
    setMessages([]);
    setConnected(false);
  };

  const sendMessage = (destination, message) => {
    if (connected && stompClient) {
      stompClient.send(destination, {}, JSON.stringify(message));
    } else {
      console.warn("Cannot send message: WebSocket is not connected");
    }
  };

  const sendIsTyping = (destination, content) => {
    console.log("Sending is-typing message:", content);
    if (connected && stompClient) {
      stompClient.send(destination, {}, JSON.stringify(content));
    } else {
      console.warn("Cannot send message: WebSocket is not connected");
    }
  };

  const clearMessages = () => {
    setMessages([]);
  };

  const clearNewChats = () => {
    setNewChats([]); // Clear after contacts are updated
  };

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        sendMessage,
        messages,
        newChats,
        clearMessages,
        resetWebSocketState,
        clearNewChats,
        isTyping,
        sendIsTyping,
        typingChats,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
