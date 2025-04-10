import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Profile from "./pages/Profile";
import Auth from "./pages/Auth";
import Home from "./pages/Home";
import MyArticles from "./pages/MyArticles";
import ArticleDetail from "./pages/ArticleDetail";
import EditArticlePage from "./pages/EditArticlePage";
import NewArticle from "./pages/NewArticle"; 

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUser(storedUsername);
    }
  }, []);

  return (
    <Router>
      <div className="app-container">
        <Navbar user={user} setUser={setUser} />
        <Routes>
          <Route path="/" element={<Navigate to="/home" />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Auth setUser={setUser} />} />
          <Route path="/login" element={<Auth setUser={setUser} />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/article-user" element={<MyArticles />} />
          <Route path="/article/:slug" element={<ArticleDetail />} />
          <Route path="/editor/:slug" element={<EditArticlePage />} />
          <Route path="/new-article" element={<NewArticle />} />
          <Route path="/profiles/:username?" element={<Profile />} />
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
          {/* <span>Xin chào, {user}!</span>
          <Link to="/profile">Profile</Link>
          <button onClick={handleLogout}>Logout</button> */}
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
