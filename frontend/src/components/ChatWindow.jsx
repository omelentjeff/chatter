import React from "react";
import { Box, Paper, Typography, TextField, Button } from "@mui/material";

export default function ChatWindow({
  selectedChat,
  chatMessages,
  message,
  setMessage,
  handleSendMessage,
  connected,
}) {
  return (
    <Paper
      elevation={3}
      sx={{
        padding: 2,
        display: "flex",
        flexDirection: "column",
        height: "calc(100vh - 160px)",
      }}
    >
      <Box sx={{ flexGrow: 1, overflowY: "auto", marginBottom: 2 }}>
        {selectedChat ? (
          chatMessages.map((msg) => (
            <Typography
              key={msg.messageId}
              variant="body2"
              sx={{ marginBottom: 1 }}
            >
              <strong>{msg.sender.username}:</strong> {msg.content}
              <br />
              <span style={{ fontSize: "0.8em", color: "gray" }}>
                {new Date(msg.createdAt).toLocaleString()}
              </span>
            </Typography>
          ))
        ) : (
          <Typography variant="body2" color="textSecondary">
            Select a chat to view messages.
          </Typography>
        )}
      </Box>
      <form onSubmit={handleSendMessage}>
        <TextField
          label="Type a message..."
          variant="outlined"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ marginBottom: 1 }}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          fullWidth
          disabled={!connected || !message.trim()}
        >
          Send
        </Button>
      </form>
    </Paper>
  );
}
