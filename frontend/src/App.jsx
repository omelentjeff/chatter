import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import Signup from "./components/Signup";
import { AuthProvider } from "./hooks/AuthProvider";

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/signup" element={<Signup />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
