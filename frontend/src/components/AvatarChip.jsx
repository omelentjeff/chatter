import * as React from "react";
import { Avatar, Chip, Menu, MenuItem, Box } from "@mui/material";
import FaceIcon from "@mui/icons-material/Face";
import { useAuth } from "../hooks/AuthProvider";

export default function AvatarChip() {
  const { logout, username } = useAuth();
  const [anchorEl, setAnchorEl] = React.useState(null); // For managing menu state
  const isOpen = Boolean(anchorEl);

  // Handle opening the menu
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  // Handle closing the menu
  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // Handle logout
  const handleLogout = () => {
    handleMenuClose(); // Close the menu before logging out
    logout();
  };

  return (
    <>
      <Chip
        sx={{
          backgroundColor: "white",
          cursor: "pointer", // Make the Chip clickable
          padding: "6px 12px",
          borderRadius: "20px",
          boxShadow: 2, // Subtle shadow for better visual impact
          "&:hover": {
            backgroundColor: "#f0f0f0", // Light hover effect
          },
        }}
        icon={<FaceIcon />}
        label={username}
        onClick={handleMenuOpen} // Open the menu on click
      />
      <Menu
        anchorEl={anchorEl}
        open={isOpen}
        onClose={handleMenuClose} // Close menu when clicking outside
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        transformOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <MenuItem onClick={handleLogout} sx={{ color: "#d32f2f" }}>
          Logout
        </MenuItem>{" "}
        {/* Logout option with red color */}
      </Menu>
    </>
  );
}
