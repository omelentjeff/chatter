import React, { useState, useMemo, useEffect } from "react";
import { debounce } from "lodash";
import { searchByUsername } from "../apiService";
import { useAuth } from "../hooks/AuthProvider";
import {
  TextField,
  InputAdornment,
  List,
  ListItem,
  ListItemText,
  Paper,
  Box,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ClearIcon from "@mui/icons-material/Clear";

export default function SearchDialog({ onClose, onClick }) {
  const [input, setInput] = useState("");
  const [suggestion, setSuggestion] = useState(null);
  const [showSuggestion, setShowSuggestion] = useState(false);
  const { token, username } = useAuth();

  const fetchSuggestions = useMemo(
    () =>
      debounce(async (value) => {
        if (value) {
          try {
            const result = await searchByUsername(token, value);
            const suggestionsData = result || null;

            if (suggestionsData && suggestionsData.username === username) {
              setSuggestion(null);
              setShowSuggestion(true);
              return;
            }

            setSuggestion(suggestionsData);
            setShowSuggestion(true);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestion(null);
          }
        } else {
          setSuggestion(null);
          setShowSuggestion(false);
        }
      }, 300),
    [token]
  );

  const handleInputChange = (e) => {
    setInput(e.target.value);
    fetchSuggestions(e.target.value);
  };

  const handleClearInput = () => {
    setInput("");
    setSuggestion(null);
    setShowSuggestion(false);
  };

  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.username);
    setSuggestion(null);
    setShowSuggestion(false);
    onClick(suggestion);
  };

  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: 500,
        margin: "auto",
        mt: 2,
        position: "relative",
      }}
    >
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search by username"
        value={input}
        onChange={handleInputChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          endAdornment: input && (
            <InputAdornment position="end">
              <IconButton onClick={handleClearInput}>
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {showSuggestion && (
        <Paper
          elevation={3}
          sx={{
            position: "absolute",
            width: "100%",
            zIndex: 2000,
            maxHeight: 400,

            borderRadius: 1,
          }}
        >
          <List dense>
            {suggestion === null ? (
              <ListItem>
                <ListItemText>No results found</ListItemText>
              </ListItem>
            ) : (
              <ListItem
                key={suggestion.id}
                button
                onClick={() => handleSuggestionClick(suggestion)}
              >
                <ListItemText primary={suggestion.username} />
              </ListItem>
            )}
          </List>
        </Paper>
      )}
    </Box>
  );
}
