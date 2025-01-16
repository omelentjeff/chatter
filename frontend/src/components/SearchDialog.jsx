import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Button,
} from "@mui/material";

const SearchDialog = ({ open, onClose, onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSearch = () => {
    onSearch(searchQuery);
    setSearchQuery(""); // Clear search after use
    onClose(); // Close the dialog
  };

  const handleCancel = () => {
    setSearchQuery(""); // Clear the search query
    onClose(); // Close the dialog
  };

  return (
    <Dialog open={open} onClose={handleCancel}>
      <DialogTitle>Search Contacts</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Search"
          fullWidth
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel}>Cancel</Button>
        <Button onClick={handleSearch} variant="contained">
          Search
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SearchDialog;
