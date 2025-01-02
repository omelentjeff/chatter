import React, { useEffect, useState } from "react";
import { List, ListItem, ListItemText, Typography, Box } from "@mui/material";
import { fetchData } from "../apiService";
import { useAuth } from "../hooks/AuthProvider";

export default function ContactList({ selectedChat, setSelectedChat }) {
  const [contacts, setContacts] = useState([]);
  const { userId, token } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await fetchData(token, userId);
        console.log("Contacts fetched:", data);
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [token, userId]);

  return (
    <Box sx={{ height: "100%", overflowY: "auto", padding: 2 }}>
      <Typography variant="h6" sx={{ marginBottom: 2 }}>
        Chats
      </Typography>
      <List>
        {contacts.map((chat) => {
          // Find the other user's name in the chat and make it title of the chat
          const otherUser = chat.users.find((user) => user.id !== userId);
          const displayName = otherUser ? otherUser.username : "Unnamed Chat";

          return (
            <ListItem
              button
              key={chat.chatId}
              selected={selectedChat?.chatId === chat.chatId}
              onClick={() => setSelectedChat(chat)}
            >
              <ListItemText primary={displayName} />
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
}
