import * as React from "react";
import { Avatar, Chip, Popover, Box, Button } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { useAuth } from "../hooks/AuthProvider";
import { useWebSocket } from "../hooks/WebSocketProvider";

export default function AvatarChip() {
  const { logout, username } = useAuth();
  const { resetWebSocketState } = useWebSocket();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isOpen = Boolean(anchorEl);

  const handlePopoverOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handlePopoverClose();
    logout(resetWebSocketState);
  };
  return (
    <>
      <Chip
        sx={{
          backgroundColor: "white",
          cursor: "pointer",
          padding: "6px 12px",
          borderRadius: "20px",
          boxShadow: 2,
          "&:hover": {
            backgroundColor: "#f0f0f0",
          },
        }}
        icon={<FaceIcon />}
        label={username}
        onClick={handlePopoverOpen}
      />
      <Popover
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handlePopoverClose}
        anchorOrigin={{ vertical: "center", horizontal: "right" }}
        transformOrigin={{ vertical: "center", horizontal: "left" }}
        PaperProps={{
          sx: {
            padding: 0.8,
            borderRadius: 2,
            boxShadow: 3,
            backgroundColor: "#fff",
            marginLeft: "2px",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <Button
            onClick={handleLogout}
            variant="contained"
            color="error"
            size="small"
            sx={{
              textTransform: "none",
              borderRadius: "8px",
              padding: "6px 16px",
              boxShadow: 1,
            }}
          >
            Logout
          </Button>
        </Box>
      </Popover>
    </>
  );
}
