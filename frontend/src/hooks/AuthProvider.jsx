// src/hooks/AuthProvider.js
import { useContext, createContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [username, setUsername] = useState(null);
  const [role, setRole] = useState(null);
  const [userId, setUserId] = useState(null);
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL;

  const isTokenExpired = (token) => {
    try {
      const decodedToken = jwtDecode(token);
      return decodedToken.exp * 1000 < Date.now();
    } catch {
      return true; // Treat invalid tokens as expired
    }
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      if (isTokenExpired(storedToken)) {
        localStorage.removeItem("token");
        setToken("");
        navigate("/");
      } else {
        setToken(storedToken);
        const decodedToken = jwtDecode(storedToken);
        setUsername(decodedToken.sub);
        setUserId(decodedToken.id);
      }
    }
  }, [navigate]);

  const authenticate = async (username, password) => {
    try {
      const response = await axios.post(`${API_URL}/auth/authenticate`, {
        username,
        password,
      });

      if (response.data.token) {
        const decodedToken = jwtDecode(response.data.token);
        console.log("decodedToken", decodedToken);
        console.log("user id: ", decodedToken.id);

        setUsername(decodedToken.sub);
        //setRole(decodedToken.role[0].authority);
        setToken(response.data.token);
        setUserId(decodedToken.id);
        localStorage.setItem("token", response.data.token);
        return response.data;
      }

      throw new Error("Authentication failed");
    } catch (error) {
      throw (
        error.response?.data ||
        new Error("An error occurred during authentication")
      );
    }
  };

  const register = async (username, password, role) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        username,
        password,
        role,
      });

      if (response.data.token) {
        const decodedToken = jwtDecode(response.data.token);
        setUsername(decodedToken.sub);
        //setRole(decodedToken.role[0].authority || "USER");
        setToken(response.data.token);
        localStorage.setItem("token", response.data.token);
        return response.data;
      }

      throw new Error("Registration failed");
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error("An error occurred during registration");
      }
    }
  };

  const logout = (cleanupCallback) => {
    setUsername(null);
    setRole(null);
    setToken("");
    setUserId(null);
    localStorage.removeItem("token");
    cleanupCallback();
    navigate("/");
  };

  return (
    <AuthContext.Provider
      value={{ username, userId, role, token, authenticate, register, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
