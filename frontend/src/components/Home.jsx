import React, { useEffect, useState } from "react";
import { Grid, Paper, Box, Typography, TextField, Button } from "@mui/material";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { useWebSocket } from "../hooks/WebSocketProvider";
import { useAuth } from "../hooks/AuthProvider";
import { fetchMessagesByChatId } from "../apiService";

export default function Home() {
  const [message, setMessage] = useState("");
  const {
    connected,
    sendMessage,
    messages: websocketMessages,
  } = useWebSocket();
  const { userId, token } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);

  // Fetch messages when a chat is selected
  useEffect(() => {
    const fetchChatMessages = async () => {
      if (selectedChat) {
        try {
          const messages = await fetchMessagesByChatId(
            token,
            selectedChat.chatId
          );
          setChatMessages(messages);
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchChatMessages();
  }, [selectedChat, token]);

  // Merge WebSocket messages with fetched messages
  useEffect(() => {
    if (selectedChat && websocketMessages.length > 0) {
      const newMessage = websocketMessages[websocketMessages.length - 1];
      if (newMessage.chat.chatId === selectedChat.chatId) {
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    }
  }, [websocketMessages, selectedChat]);

  const handleSendMessage = (event) => {
    event.preventDefault();
    if (!selectedChat) {
      console.error("No chat selected.");
      return;
    }

    if (connected) {
      sendMessage("/app/chat", {
        chatId: selectedChat.chatId,
        senderId: userId,
        content: message,
      });
    }
    setMessage("");
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh", padding: 4 }}>
      {/* Left side: Chats List */}
      <Grid
        item
        xs={3}
        sx={{
          borderRight: "1px solid #ccc",
          padding: 2,
        }}
      >
        <ContactList
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
        />
      </Grid>

      {/* Right side: Chat Window */}
      <Grid item xs={9} sx={{ padding: 2 }}>
        <ChatWindow
          selectedChat={selectedChat}
          chatMessages={chatMessages}
          message={message}
          setMessage={setMessage}
          handleSendMessage={handleSendMessage}
          connected={connected}
          userId={userId}
        />
      </Grid>
    </Grid>
  );
}
