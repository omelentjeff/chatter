import React, { useEffect, useState } from "react";
import { Grid } from "@mui/material";
import ContactList from "./ContactList";
import ChatWindow from "./ChatWindow";
import { useWebSocket } from "../hooks/WebSocketProvider";
import { useAuth } from "../hooks/AuthProvider";
import {
  fetchMessagesByChatId,
  fetchData,
  fetchUnreadCounts,
  markMessagesAsRead,
} from "../apiService";

export default function Home() {
  const [message, setMessage] = useState("");
  const {
    connected,
    sendMessage,
    messages: websocketMessages,
    clearMessages,
    newChats,
    clearNewChats,
    isTyping,
    sendIsTyping,
    typingChats,
  } = useWebSocket();
  const { userId, token, username } = useAuth();
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatMessages, setChatMessages] = useState([]);
  const [latestMessages, setLatestMessages] = useState({});
  const [contacts, setContacts] = useState([]);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [loading, setLoading] = useState(true);

  // Fetch initial contact list and latest messages
  useEffect(() => {
    if (!userId || !token) return;

    const fetchContacts = async () => {
      setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchContacts();
  }, [token, userId]);

  useEffect(() => {
    if (newChats.length > 0) {
      setContacts((prevContacts) => {
        const updatedContacts = [...prevContacts];

        newChats.forEach((newChat) => {
          // Avoid duplicate chats
          if (!updatedContacts.some((chat) => chat.chatId === newChat.chatId)) {
            updatedContacts.unshift(newChat);
          }
        });

        return updatedContacts;
      });
      clearNewChats();
    }
  }, [newChats]);

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
          clearMessages();
        } catch (error) {
          console.error("Error fetching messages:", error);
        }
      }
    };

    fetchChatMessages();
  }, [selectedChat, token]);

  // Fetch unread message counts on initial load
  useEffect(() => {
    if (!userId || !token) return;

    const fetchUnreadCountsData = async () => {
      try {
        const unreadCounts = await fetchUnreadCounts(token, userId);
        setUnreadCounts(unreadCounts);
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      }
    };

    fetchUnreadCountsData();
  }, [userId, token, selectedChat]);

  // Mark messages as read when a chat is selected
  useEffect(() => {
    if (selectedChat) {
      setUnreadCounts((prevCounts) => ({
        ...prevCounts,
        [selectedChat.chatId]: 0, // Reset unread count for the selected chat immediately
      }));

      const markAllMessagesAsRead = async () => {
        try {
          await markMessagesAsRead(token, selectedChat.chatId, userId);
          setUnreadCounts((prevCounts) => ({
            ...prevCounts,
            [selectedChat.chatId]: 0, // Reset unread count for this chat
          }));
        } catch (error) {
          console.error("Error marking messages as read:", error);
        }
      };

      markAllMessagesAsRead();
    }
  }, [selectedChat, token, userId]);

  // Handle WebSocket messages and update latest messages
  useEffect(() => {
    if (websocketMessages.length > 0) {
      const newMessage = websocketMessages[websocketMessages.length - 1];
      const chatId = newMessage.chat.chatId;

      setLatestMessages((prevLatestMessages) => ({
        ...prevLatestMessages,
        [chatId]: {
          content: newMessage.content,
          sender: newMessage.sender.username,
          createdAt: newMessage.createdAt,
        },
      }));

      if (selectedChat && selectedChat.chatId === chatId) {
        // If the selected chat is the same as the incoming message's chat,
        // we mark the message as read and reset the unread count for this chat.
        setChatMessages((prevMessages) => [...prevMessages, newMessage]);
        clearMessages();

        const markAllMessagesAsRead = async () => {
          try {
            await markMessagesAsRead(token, chatId, userId);
            setUnreadCounts((prevCounts) => ({
              ...prevCounts,
              [chatId]: 0, // Reset the unread count for this chat
            }));
          } catch (error) {
            console.error("Error marking messages as read:", error);
          }
        };

        markAllMessagesAsRead();
      } else {
        console.log("Message from another chat:", newMessage);
        // If the message is from a chat that is not selected, we increase the unread count
        setUnreadCounts((prevCounts) => {
          const newCounts = { ...prevCounts };
          newCounts[chatId] = (newCounts[chatId] || 0) + 1;
          return newCounts;
        });
      }
    }
  }, [websocketMessages, selectedChat]);

  // Sort contacts by latest message's createdAt
  useEffect(() => {
    if (contacts.length > 0) {
      setContacts((prevContacts) =>
        [...prevContacts].sort((a, b) => {
          const latestA =
            latestMessages[a.chatId]?.createdAt || "1970-01-01T00:00:00Z";
          const latestB =
            latestMessages[b.chatId]?.createdAt || "1970-01-01T00:00:00Z";
          return new Date(latestB) - new Date(latestA);
        })
      );
    }
  }, [latestMessages]);

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
    handleIsTyping(false);
    setMessage("");
  };

  const handleIsTyping = (isTyping) => {
    if (connected && selectedChat) {
      const recipient = selectedChat.users.find((user) => user.id !== userId);

      if (!recipient) return;

      sendIsTyping("/app/is-typing", {
        chatId: selectedChat.chatId,
        recipientId: recipient.id,
        senderId: userId,
        isTyping: isTyping,
      });
    }
  };

  return (
    <Grid container sx={{ height: "100vh", paddingTop: 4, overflow: "hidden" }}>
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
          setContacts={setContacts}
          latestMessages={latestMessages}
          unreadCounts={unreadCounts}
          loading={loading}
          typingChats={typingChats}
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
          handleIsTyping={handleIsTyping}
          connected={connected}
          userId={userId}
          typingChats={typingChats}
        />
      </Grid>
    </Grid>
  );
}
