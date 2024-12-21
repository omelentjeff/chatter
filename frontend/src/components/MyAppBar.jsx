import * as React from "react";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";
import { useAuth } from "../hooks/AuthProvider";
import AvatarChip from "./AvatarChip";

export default function MyAppBar() {
  const { token } = useAuth();

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" sx={{ backgroundColor: "#2F80ED" }}>
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, textAlign: "center" }}
          >
            Chatter
          </Typography>
          {token && <AvatarChip />} {/* Show AvatarChip if authenticated */}
        </Toolbar>
      </AppBar>
    </Box>
  );
}
