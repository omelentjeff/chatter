import React, { useState } from "react";
import { Grid, Typography, TextField, Paper, Box } from "@mui/material";

export default function Home() {
  // State to track the chat message input
  const [message, setMessage] = useState("");

  // Handle submit: log the message to the console
  const handleSubmit = (event) => {
    event.preventDefault();
    console.log("Message:", message);
    setMessage("");
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
