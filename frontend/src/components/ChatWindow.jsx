import React, { useEffect, useRef, useState } from "react";
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
  handleIsTyping,
  connected,
  userId,
  typingChats,
}) {
  const messagesEndRef = useRef(null);
  const initialRenderRef = useRef(true);
  const otherUser = selectedChat
    ? selectedChat.users.find((user) => user.id !== userId)
    : null;
  const displayName = otherUser ? otherUser.username : "Unnamed Chat";
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = (behavior = "smooth") => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior });
    }
  };

  useEffect(() => {
    if (initialRenderRef.current) {
      scrollToBottom("auto");
      initialRenderRef.current = false;
    } else {
      scrollToBottom("smooth");
    }
  }, [chatMessages]);

  useEffect(() => {
    initialRenderRef.current = true;
  }, [selectedChat]);

  const handlerIsTyping = (typing) => {
    if (connected && selectedChat) {
      handleIsTyping(typing);
    }
  };

  const handleInputChange = (e) => {
    const text = e.target.value;
    setMessage(text);

    if (text.length > 0 && !isTyping) {
      setIsTyping(true);
      handlerIsTyping(true);
    } else if (text.length === 0 && isTyping) {
      setIsTyping(false);
      handlerIsTyping(false);
    }
  };

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

      {selectedChat && typingChats[selectedChat.chatId] && (
        <Typography
          variant="caption"
          sx={{
            color: "gray",
            marginBottom: "4px",
            marginLeft: "8px",
          }}
        >
          {otherUser?.username} is typing...
        </Typography>
      )}

      <form onSubmit={handleSendMessage}>
        <TextField
          label="Send a message..."
          variant="outlined"
          fullWidth
          value={message}
          onChange={handleInputChange}
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
