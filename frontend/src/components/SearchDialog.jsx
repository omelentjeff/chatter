import React, { useState, useMemo } from "react";
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

export default function SearchDialog({ open, onClose, onClick }) {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { token } = useAuth();

  // Function to fetch suggestions with debounce
  const fetchSuggestions = useMemo(
    () =>
      debounce(async (value) => {
        if (value) {
          try {
            const result = await searchByUsername(token, value);
            const suggestionsData = result.content || [];
            console.log("Suggestions:", suggestionsData);
            setSuggestions(suggestionsData);
            setShowSuggestions(true);
          } catch (error) {
            console.error("Error fetching suggestions:", error);
            setSuggestions([]);
          }
        } else {
          setSuggestions([]);
          setShowSuggestions(false);
        }
      }, 300),
    []
  );

  // Handle input changes and fetch suggestions
  const handleInputChange = (e) => {
    setInput(e.target.value);
    fetchSuggestions(e.target.value);
  };

  // Handle input clear
  const handleClearInput = () => {
    setInput("");
    setSuggestions([]);
    setShowSuggestions(false);
  };

  // Handle suggestion click
  const handleSuggestionClick = (suggestion) => {
    setInput(suggestion.name);
    setSuggestions([]);
    setShowSuggestions(false);
    onClick(suggestion);
  };

  return (
    open && (
      <Box
        sx={{
          width: "100%",
          maxWidth: 500,
          margin: "auto",
          mt: 4,
          position: "relative",
        }}
      >
        <form onSubmit={(e) => e.preventDefault()}>
          <Grid container spacing={1}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Search by username"
                value={input || ""}
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
            </Grid>
          </Grid>

          {/* Suggestion dropdown */}
          {showSuggestions && (
            <Paper
              elevation={3}
              sx={{
                position: "absolute",
                top: "64px",
                width: "100%",
                zIndex: 10,
                maxHeight: 400,
                overflowY: "auto",
                borderRadius: 1,
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              }}
            >
              <List dense>
                {suggestions.length === 0 ? (
                  <ListItem>
                    <ListItemText>No results found</ListItemText>
                  </ListItem>
                ) : (
                  suggestions.map((suggestion, index) => (
                    <ListItem
                      key={index}
                      button
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <ListItemText primary={suggestion.username} />
                    </ListItem>
                  ))
                )}
              </List>
            </Paper>
          )}
        </form>
      </Box>
    )
  );
}
