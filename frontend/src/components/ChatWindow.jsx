import React, { useEffect, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

export default function ChatWindow({
  selectedChat,
  chatMessages,
  message,
  setMessage,
  handleSendMessage,
  connected,
  userId,
}) {
  const messagesEndRef = useRef(null);
  const otherUser = selectedChat
    ? selectedChat.users.find((user) => user.id !== userId)
    : null;
  const displayName = otherUser ? otherUser.username : "Unnamed Chat";

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatMessages]);

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        height: "100%",
      }}
    >
      {selectedChat && (
        <Box
          sx={{
            backgroundColor: "#2F80ED",
            color: "white",
            padding: "8px 12px",
            borderRadius: "8px",
            marginBottom: 2,
          }}
        >
          <Typography variant="h6">{displayName}</Typography>
        </Box>
      )}
      <Box sx={{ flexGrow: 1, overflowY: "auto", marginBottom: 2 }}>
        {selectedChat ? (
          chatMessages.map((msg) => (
            <Box
              key={msg.messageId}
              sx={{
                display: "flex",
                justifyContent:
                  msg.sender.id === userId ? "flex-end" : "flex-start",
                marginBottom: 1,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  backgroundColor:
                    msg.sender.id === userId ? "#dfeefc" : "#f1f0f0",
                  borderRadius: "8px",
                  padding: "8px 12px",
                  maxWidth: "70%",
                  wordWrap: "break-word",
                  boxShadow: 1,
                }}
              >
                <strong>
                  {msg.sender.id === userId ? "You" : msg.sender.username}:
                </strong>{" "}
                {msg.content}
                <br />
                <span
                  style={{
                    fontSize: "0.8em",
                    color: "gray",
                    display: "block",
                    textAlign: msg.sender.id === userId ? "right" : "left",
                  }}
                >
                  {new Date(msg.createdAt).toLocaleString()}
                </span>
              </Typography>
            </Box>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            Select a chat to view messages.
          </Typography>
        )}
        <div ref={messagesEndRef} />
      </Box>

      <form onSubmit={handleSendMessage}>
        <TextField
          label="Send a message..."
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  type="submit"
                  color="primary"
                  disabled={!connected || !message.trim()}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </form>
    </Paper>
  );
}
