import React, { createContext, useContext, useEffect, useState } from "react";
import { over } from "stompjs";
import SockJS from "sockjs-client";
import { useAuth } from "./AuthProvider";

const WebSocketContext = createContext();

export const WebSocketProvider = ({ children }) => {
  const { userId, token } = useAuth();
  const [stompClient, setStompClient] = useState(null);
  const [connected, setConnected] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (userId && token) {
      const socket = new SockJS("http://localhost:8080/ws");
      const client = over(socket);
      client.connect(
        {},
        () => {
          setConnected(true);
          console.log("WebSocket connected");

          // Automatically subscribe to the user's queue
          client.subscribe(`/user/${userId}/queue/messages`, (payload) => {
            const message = JSON.parse(payload.body);
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log("Received message:", message);
          });
        },
        (error) => {
          console.error("WebSocket error:", error);
        }
      );

      setStompClient(client);

      // Cleanup on unmount
      return () => {
        client.disconnect(() => {
          setMessages([]);
          console.log("WebSocket disconnected");
        });
      };
    }
  }, [userId, token]);

  const sendMessage = (destination, message) => {
    if (connected && stompClient) {
      stompClient.send(destination, {}, JSON.stringify(message));
    }
  };

  return (
    <WebSocketContext.Provider value={{ connected, sendMessage, messages }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
