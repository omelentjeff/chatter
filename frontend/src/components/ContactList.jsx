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
import AvatarChip from "./AvatarChip";

const ContactList = ({
  selectedChat,
  setSelectedChat,
  contacts,
  latestMessages,
}) => {
  const { userId, username } = useAuth();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        height: "100vh",
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
            const latestMessage = latestMessages[chat.chatId];

            return (
              <React.Fragment key={chat.chatId}>
                <ListItem
                  button
                  selected={selectedChat?.chatId === chat.chatId}
                  onClick={() => setSelectedChat(chat)}
                  sx={{
                    paddingBottom: 1, // Adjust the padding for a little more space
                  }}
                >
                  <ListItemText
                    primary={
                      <Typography variant="body1" fontWeight="bold">
                        {displayName}
                      </Typography>
                    }
                    secondary={
                      latestMessage && latestMessage.sender ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography
                            variant="body2"
                            color="textSecondary"
                            sx={{
                              display: "inline-block",
                              maxWidth: "100%",
                              whiteSpace: "nowrap",
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                            }}
                          >
                            {latestMessage.sender === username
                              ? `You: ${latestMessage.content}`
                              : `${latestMessage.sender}: ${latestMessage.content}`}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(
                              latestMessage.createdAt
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="textSecondary">
                          No messages
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                <Divider />
              </React.Fragment>
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
