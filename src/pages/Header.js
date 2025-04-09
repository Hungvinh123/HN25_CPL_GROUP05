// Header.js
import React, { useState } from "react";
import "./Header.css";
import { Link } from "react-router-dom";
const Header = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
    };

    return (
        <header className="header">
            <div className="header-container">
                <div className="logo">
                    <h2>conduit</h2>
                </div>
                <nav className="nav-menu">
                    {isLoggedIn ? (
                        <div className="user-menu">
                            <Link to={`/home`} className="nav-item">
                                Home
                            </Link>
                            <Link to="/new-article" className="nav-item">
                                New Article
                            </Link>
                            <Link to="/article-user" className="nav-item">
                                Your Articles
                            </Link>
                            <Link to={`/profile`} className="nav-item">
                                {localStorage.getItem("username")}
                            </Link>
                            <button onClick={handleLogout} className="nav-item logout-btn">
                                Logout
                            </button>
                        </div>
                    ) : (
                        <div className="auth-menu">
                            <Link to={`/login`} className="nav-item">
                                Login
                            </Link>
                            <Link to={`/register`} className="nav-item signup">
                                Sign Up
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
};

export default Header;