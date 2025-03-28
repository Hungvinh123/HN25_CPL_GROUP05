import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import "./App.css";


function App() {
  const [user, setUser] = useState(null);

  // ✅ Kiểm tra nếu có user đã đăng nhập
  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <h1>Conduit App</h1>
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/register" element={<Auth setUser={setUser} />} />
          <Route path="/login" element={<Auth setUser={setUser} />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </Router>
  );
}

// ✅ Tách Navbar thành component riêng
const Navbar = ({ user, setUser }) => {
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
  };

  return (
    <nav>
      {user ? (
        <>
          <span>Xin chào, {user}!</span>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <>
          <Link to="/register">Register</Link>
          <Link to="/login">Login</Link>
        </>
      )}
    </nav>
  );
};

export default App;
