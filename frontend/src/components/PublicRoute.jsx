import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/AuthProvider";

const PublicRoute = ({ children }) => {
  const { token } = useAuth();

  // Redirect to "/home" if the user is authenticated
  if (token) {
    return <Navigate to="/home" />;
  }

  return children;
};

export default PublicRoute;
