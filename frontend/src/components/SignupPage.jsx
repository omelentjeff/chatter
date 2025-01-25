import React from "react";
import { Grid, Box, Typography } from "@mui/material";
import Signup from "./Signup";

export default function SignupPage() {
  return (
    <Grid container sx={{ height: "100vh" }}>
      {/* Left Section */}
      <Grid
        item
        xs={8}
        sx={{
          background: "linear-gradient(to right, #56CCF2, #2F80ED)",
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
            Join Chatter!
          </Typography>
          <Typography variant="h6">
            Sign up to start your journey with us.
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
        <Signup />
      </Grid>
    </Grid>
  );
}
