import React from "react";
import { Box, Grid } from "@mui/material";

export default function Home() {
  return (
    <Box sx={{ height: "100vh", display: "flex", overflow: "hidden" }}>
      {/* Grid Container */}
      <Grid container sx={{ height: "100%" }}>
        {/* Contact List Section */}
        <Grid
          item
          xs={4}
          sx={{
            backgroundColor: "#f5f5f5",
            borderRight: "1px solid #ddd",
            overflowY: "auto",
          }}
        >
          <Box sx={{ p: 2 }}>
            <h2>Contact List</h2>
          </Box>
        </Grid>

        {/* Chat Window Section */}
        <Grid
          item
          xs={8}
          sx={{
            backgroundColor: "#fff",
            overflowY: "auto",
          }}
        >
          <Box sx={{ p: 2 }}>
            <h2>Chat Window</h2>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}
