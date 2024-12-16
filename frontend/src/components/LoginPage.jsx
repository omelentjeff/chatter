// File: LoginPage.js
import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import Login from "./Login";

export default function LoginPage() {
  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Section */}
      <Grid
        item
        xs={8}
        sx={{
          backgroundImage: "url('/assets/bg.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "black",
          padding: 4,
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
          backgroundColor: "white",
          padding: 4,
        }}
      >
        <Login />
      </Grid>
    </Grid>
  );
}
