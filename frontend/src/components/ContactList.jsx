import React, { useEffect, useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import { useAuth } from "../hooks/AuthProvider";
import { fetchData } from "../apiService";
import AvatarChip from "./AvatarChip";

const ContactList = ({ selectedChat, setSelectedChat }) => {
  const [contacts, setContacts] = useState([]);
  const { userId, token, logout } = useAuth();

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const data = await fetchData(token, userId);
        setContacts(data);
      } catch (error) {
        console.error("Error fetching contacts:", error);
      }
    };

    fetchContacts();
  }, [token, userId]);

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {/* Contacts Section */}
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
              <>
                <ListItem
                  button
                  key={chat.chatId}
                  selected={selectedChat?.chatId === chat.chatId}
                  onClick={() => setSelectedChat(chat)}
                >
                  <ListItemText primary={displayName} />
                </ListItem>
                <Divider />
              </>
            );
          })}
        </List>
      </Box>

      {/* User Info and Logout */}
      <Box
        sx={{
          padding: 2,
          borderTop: "1px solid #ccc",
          backgroundColor: "#f7f7f7",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <AvatarChip />
        </Box>
      </Box>
    </Box>
  );
};

export default ContactList;
