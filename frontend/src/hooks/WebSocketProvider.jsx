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

          // Subscribe to the new user's queue
          client.subscribe(`/user/${userId}/queue/messages`, (payload) => {
            const message = JSON.parse(payload.body);
            setMessages((prevMessages) => [...prevMessages, message]);
            console.log("Received message:", message);
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

  const clearMessages = () => {
    setMessages([]);
  };

  return (
    <WebSocketContext.Provider
      value={{
        connected,
        sendMessage,
        messages,
        clearMessages,
        resetWebSocketState,
      }}
    >
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
