// File: LoginPage.js
import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import Login from "./Login";
import bg from "../assets/bg.jpg";

// background: #ff9966;  /* fallback for old browsers */
// background: -webkit-linear-gradient(to right, #ff5e62, #ff9966);  /* Chrome 10-25, Safari 5.1-6 */
// background: linear-gradient(to right, #ff5e62, #ff9966); /* W3C, IE 10+/ Edge, Firefox 16+, Chrome 26+, Opera 12+, Safari 7+ */

export default function LoginPage() {
  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Section */}
      <Grid
        item
        xs={8}
        sx={{
          background: "linear-gradient(to right, #ff9966, #ff5e62)", // Corrected linear-gradient syntax
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          color: "white",
          padding: 4,
          paddingTop: 20,
        }}
      >
        <Box textAlign="center">
          <Typography variant="h2" sx={{ fontWeight: "bold", mb: 2 }}>
            Welcome to Chatter!
          </Typography>
          <Typography variant="h6">
            Sign in to continue and explore our amazing features.
          </Typography>
        </Box>
      </Grid>

      {/* Right Section */}
      <Grid
        item
        xs={4}
        sx={{
          display: "flex",
          alignItems: "start",
          justifyContent: "center",
          backgroundColor: "#f7f7f7",
          padding: 4,
          paddingLeft: 0,
          paddingTop: 0,
        }}
      >
        <Login />
      </Grid>
    </Grid>
  );
}
