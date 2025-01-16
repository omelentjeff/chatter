import React, { useState } from "react";
import {
  List,
  ListItem,
  ListItemText,
  Typography,
  Box,
  Divider,
  Badge,
  IconButton,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { useAuth } from "../hooks/AuthProvider";
import AvatarChip from "./AvatarChip";
import SearchDialog from "./SearchDialog"; // Import the SearchDialog component

const ContactList = ({
  selectedChat,
  setSelectedChat,
  contacts,
  latestMessages,
  unreadCounts,
}) => {
  const { userId, username } = useAuth();
  const [isDialogOpen, setDialogOpen] = useState(false);

  const handleDialogOpen = () => {
    setDialogOpen(true);
  };

  const handleDialogClose = () => {
    setDialogOpen(false);
  };

  const handleSearch = (query) => {
    console.log("Search Query:", query);
    // Implement search logic here
  };

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
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 2,
          }}
        >
          <Typography
            variant="h5"
            sx={{ marginTop: 1, textAlign: "center", flexGrow: 1 }}
          >
            Chats
          </Typography>
          <IconButton
            onClick={handleDialogOpen}
            sx={{
              color: "white",
              "&:hover": {
                backgroundColor: "rgba(255, 255, 255, 0.2)",
              },
            }}
          >
            <AddIcon />
          </IconButton>
        </Box>

        <List>
          {contacts.map((chat) => {
            const otherUser = chat.users.find((user) => user.id !== userId);
            const displayName = otherUser ? otherUser.username : "Unnamed Chat";
            const latestMessage = latestMessages[chat.chatId];
            const unreadCount = unreadCounts[chat.chatId] || 0;

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
                        ? "#5fb2ff"
                        : "transparent",
                    "&:hover": {
                      backgroundColor:
                        selectedChat?.chatId === chat.chatId
                          ? "#5fb2ff"
                          : "#7db3e5",
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

      {/* Search Dialog */}
      <SearchDialog
        open={isDialogOpen}
        onClose={handleDialogClose}
        onSearch={handleSearch}
      />
    </Box>
  );
};

export default ContactList;
