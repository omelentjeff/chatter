// src/hooks/WebSocketProvider.js
import React, { createContext, useContext, useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthProvider";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { userId, token } = useAuth();
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    if (userId && token) {
      // Establish WebSocket connection
      const socket = new SockJS("http://localhost:8080/ws");
      const client = over(socket);
      client.connect(
        {},
        () => {
          setConnected(true);
          console.log("WebSocket connected");
        },
        (error) => {
          console.error("WebSocket error:", error);
        }
      );
      setStompClient(client);

      // Cleanup on unmount
      return () => {
        client.disconnect(() => {
          console.log("WebSocket disconnected");
        });
      };
    }
  }, [userId, token]);

  const subscribeToTopic = (topic, callback) => {
    if (connected && stompClient) {
      stompClient.subscribe(topic, callback);
    }
  };

  const sendMessage = (destination, message) => {
    if (connected && stompClient) {
      stompClient.send(destination, {}, JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider
      value={{ connected, subscribeToTopic, sendMessage }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
