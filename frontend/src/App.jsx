import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import MyAppBar from "./components/MyAppBar";
import Home from "./components/Home";
import { AuthProvider, useAuth } from "./hooks/AuthProvider";

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppLayout />
      </AuthProvider>
    </Router>
  );
}

function AppLayout() {
  const { token } = useAuth(); // Assume `user` is null when not authenticated
  console.log("User", token);

  return (
    <>
      {token && <MyAppBar />} {/* Show AppBar only if user is authenticated */}
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </>
  );
}

export default App;
