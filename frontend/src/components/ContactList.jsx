import React from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
} from "@mui/material";
import { useAuth } from "../hooks/AuthProvider";
import AvatarChip from "./AvatarChip";

const ContactList = ({
  selectedChat,
  setSelectedChat,
  contacts,
  latestMessages,
  unreadCounts, // Add unreadCounts as a prop
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
        backgroundColor: "#2F80ED",
        color: "white",
      }}
    >
      {/* Contacts Section */}
      <Box sx={{ height: "100%", overflowY: "auto", padding: 2 }}>
        <Typography variant="h6" sx={{ marginBottom: 2 }}>
          Chats
        </Typography>
        <List>
          {contacts.map((chat) => {
            const otherUser = chat.users.find((user) => user.id !== userId);
            const displayName = otherUser ? otherUser.username : "Unnamed Chat";
            const latestMessage = latestMessages[chat.chatId];
            const unreadCount = unreadCounts[chat.chatId] || 0; // Get unread count

            return (
              <React.Fragment key={chat.chatId}>
                <ListItem
                  button
                  onClick={() => setSelectedChat(chat)}
                  sx={{
                    paddingBottom: 1,
                    borderRadius: "6px",
                    backgroundColor:
                      selectedChat?.chatId === chat.chatId
                        ? "#5fb2ff" // Active background color for selected chat
                        : "transparent", // Default background color for non-selected chats
                    "&:hover": {
                      backgroundColor:
                        selectedChat?.chatId === chat.chatId
                          ? "#5fb2ff" // Keep same color on hover if selected
                          : "#7db3e5", // Change to a lighter color on hover if not selected
                    },
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography
                          variant="body1"
                          fontWeight="bold"
                          fontSize="18px"
                        >
                          {displayName}
                        </Typography>
                        {unreadCount > 0 && (
                          <Badge badgeContent={unreadCount} />
                        )}
                      </Box>
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
                            color="white"
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
                          <Typography variant="caption" color="white">
                            {new Date(
                              latestMessage.createdAt
                            ).toLocaleTimeString("en-US", {
                              hour: "numeric",
                              minute: "numeric",
                            })}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="white">
                          No messages
                        </Typography>
                      )
                    }
                  />
                </ListItem>
                <Divider sx={{ backgroundColor: "white" }} />
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
          backgroundColor: "#2F80ED",
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
