import { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import SignupPage from "./components/SignupPage";
import Home from "./components/Home";
import ProtectedRoute from "./components/ProtectedRoute";
import PublicRoute from "./components/PublicRoute";
import { WebSocketProvider } from "./hooks/WebSocketProvider";
import { AuthProvider, useAuth } from "./hooks/AuthProvider";
import { healthCheck } from "./apiService";

function App() {
  useEffect(() => {
    const healthCheckAPI = async () => {
      try {
        const response = await healthCheck();
        console.log("Health check response:", response);
      } catch (error) {
        console.error("Error checking health:", error);
      }
    };
    healthCheckAPI();
  }, []);

  return (
    <Router>
      <AuthProvider>
        <WebSocketProvider>
          <AppLayout />
        </WebSocketProvider>
      </AuthProvider>
    </Router>
  );
}

function AppLayout() {
  const { token } = useAuth();

  return (
    <>
      <Routes>
        {/* Public routes guarded for authenticated users */}
        <Route
          path="/"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />
        <Route
          path="/signup"
          element={
            <PublicRoute>
              <SignupPage />
            </PublicRoute>
          }
        />

        {/* Private routes guarded for unauthenticated users */}
        <Route element={<ProtectedRoute />}>
          <Route path="/home" element={<Home />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
