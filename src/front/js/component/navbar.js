import React from "react";
import { Link } from "react-router-dom";
import "../../styles/navbar.css";

export const Navbar = () => {
    return (
        <nav className="navbar">
            <div className="container">
                <Link to="/" className="navbar-brand">
                    <span className="brand-logo">mhavliczek</span>
                </Link>
                <div className="navbar-links">
                    <Link to="/about" className="nav-item">About</Link>
                    <Link to="/projects" className="nav-item">Projects</Link>
                    <Link to="/contact" className="nav-item">Contact</Link>
                </div>
            </div>
        </nav>
    );
};
