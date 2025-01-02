import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { useWebSocket } from "../hooks/WebSocketProvider";
import { useAuth } from "../hooks/AuthProvider";
import { fetchMessagesByChatId, fetchData } from "../apiService";

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
  const [latestMessages, setLatestMessages] = useState({});
  const [contacts, setContacts] = useState([]);

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await fetchData(token, userId);
        setContacts(data);

        // Fetch latest message for each chat
        const latestMessagesData = {};
        for (let chat of data) {
          const messages = await fetchMessagesByChatId(token, chat.chatId);
          latestMessagesData[chat.chatId] = messages[messages.length - 1]; // Last message in the chat
        }
        setLatestMessages(latestMessagesData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [token, userId]);

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
    <Grid container sx={{ height: "100vh", overflow: "hidden", padding: 4 }}>
      {/* Left side: Chats List */}
      <Grid
        item
        xs={3}
        sx={{
          height: "100%",
          borderRight: "1px solid #ccc",
        }}
      >
        <ContactList
          selectedChat={selectedChat}
          setSelectedChat={setSelectedChat}
          contacts={contacts}
          latestMessages={latestMessages}
        />
      </Grid>

      {/* Right side: Chat Window */}
      <Grid item xs={9} sx={{ height: "100%", padding: 6 }}>
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
