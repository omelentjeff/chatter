import React, { useEffect, useState } from "react";
import { Grid, Typography, TextField, Paper, Box } from "@mui/material";
import { useAuth } from "../hooks/AuthProvider";
import { over } from "stompjs";
import SockJS from "sockjs-client";

let stompClient = null;

export default function Home() {
  // State to track the chat message input
  const [message, setMessage] = useState("");
  const { userId } = useAuth();

  const onConnected = () => {
    console.log("Connected to WebSocket");
    stompClient.subscribe(`/user/${userId}/queue/messages`, onMessageReceived);
  };

  const onMessageReceived = (payload) => {
    console.log("Message received:", payload);
  };

  const onError = (error) => {
    console.error("Error connecting to WebSocket:", error);
  };

  // Handle submit: log the message to the console
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Message:", message);
    setMessage("");
    const socket = new SockJS("http://localhost:8080/ws");
    stompClient = over(socket);
    stompClient.connect({}, onConnected, onError);
  };

  return (
    <Grid container spacing={2} sx={{ height: "100vh", padding: 4 }}>
      {/* Left side: Connection List */}
      <Grid
        item
        xs={3}
        sx={{
          borderRight: "1px solid #ccc",
          padding: 2,
          textAlign: "center",
          textDecoration: "underline",
        }}
      >
        <Typography variant="h6">Connections</Typography>
      </Grid>

      {/* Right side: Chat Window */}
      <Grid item xs={9} sx={{ padding: 2 }}>
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
            {/* Display chat messages here */}
            <Typography variant="body2" sx={{ marginBottom: 1 }}></Typography>
            <Typography variant="body2" sx={{ marginBottom: 1 }}></Typography>
          </Box>

          {/* TextField for input */}
          <form onSubmit={handleSubmit}>
            <TextField
              label="Type a message..."
              variant="outlined"
              fullWidth
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ marginBottom: 1 }}
            />
          </form>
        </Paper>
      </Grid>
    </Grid>
  );
}
