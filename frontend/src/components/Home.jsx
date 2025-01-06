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
  const { userId, token, username } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [latestMessages, setLatestMessages] = useState({});
  const [contacts, setContacts] = useState([]);

  // Fetch initial contact list and latest messages
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await fetchData(token, userId);
        setContacts(data);

        // Fetch latest message for each chat
        const latestMessagesData = {};
        for (let chat of data) {
          const messages = await fetchMessagesByChatId(token, chat.chatId);
          if (messages.length > 0) {
            const latestMessage = messages[messages.length - 1];
            const sender = latestMessage.sender
              ? latestMessage.sender.username
              : "Unknown User";
            latestMessagesData[chat.chatId] = {
              content: latestMessage.content,
              sender: sender,
              createdAt: latestMessage.createdAt,
            };
          } else {
            latestMessagesData[chat.chatId] = {
              content: "No messages",
              sender: "",
              createdAt: "1970-01-01T00:00:00Z",
            };
          }
        }
        setLatestMessages(latestMessagesData);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [token, userId]);

  // Fetch messages for selected chat
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

  // Handle WebSocket messages and update latest messages
  useEffect(() => {
    if (websocketMessages.length > 0) {
      const newMessage = websocketMessages[websocketMessages.length - 1];
      setLatestMessages((prevLatestMessages) => ({
        ...prevLatestMessages,
        [newMessage.chat.chatId]: {
          content: newMessage.content,
          sender: newMessage.sender.username,
          createdAt: newMessage.createdAt,
        },
      }));

      if (selectedChat && newMessage.chat.chatId === selectedChat.chatId) {
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    }
  }, [websocketMessages, selectedChat]);

  // Sort contacts by latest message's createdAt
  useEffect(() => {
    const sortedContacts = [...contacts].sort((a, b) => {
      const latestA =
        latestMessages[a.chatId]?.createdAt || "1970-01-01T00:00:00Z";
      const latestB =
        latestMessages[b.chatId]?.createdAt || "1970-01-01T00:00:00Z";
      return new Date(latestB) - new Date(latestA);
    });
    setContacts(sortedContacts);
  }, [latestMessages, contacts]);

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

      setLatestMessages((prevLatestMessages) => ({
        ...prevLatestMessages,
        [selectedChat.chatId]: {
          content: message,
          sender: username,
          createdAt: new Date().toISOString(),
        },
      }));
    }
    setMessage("");
  };

  return (
    <Grid container sx={{ height: "100vh", padding: 2, overflow: "hidden" }}>
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
      <Grid item xs={9} sx={{ height: "100%" }}>
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
