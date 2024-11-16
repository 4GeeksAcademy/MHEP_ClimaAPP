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
                    <Link to="/" className="nav-item">Inicio</Link>
                    <Link to="/signup" className="nav-item">Registro</Link>
                    <Link to="/login" className="nav-item">Login</Link>
                </div>
            </div>
        </nav>
    );
};
