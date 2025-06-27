import React, { useContext, useState } from "react";
import { Link } from 'react-router-dom';
import { AuthContext } from './contexts/AuthContext';

function Navbar() {
    const { userData, setUserData } = useContext(AuthContext);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const [navbarOpen, setNavbarOpen] = useState(false);

    const handleLogout = () => {
        localStorage.removeItem("token"); // Remove the token from localStorage
        setUserData(null); // Reset user data to indicate logout
    };

    const toggleDropdown = () => {
        setDropdownOpen(!dropdownOpen);
    };

    const toggleNavbar = () => {
        setNavbarOpen(!navbarOpen);
    };

    return (
        <nav
            className="navbar navbar-expand-lg border-bottom"
            style={{
                backgroundColor: "#1e231c",
                borderBottom: "10px solid gray",
                height: "80px",
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                zIndex: 1000,
                padding: "0 20px"
            }}
        >
            {/* Left Section: Logo */}
            <a className="navbar-brand" href="#" style={{ color: "white", fontStyle: "inherit" }}>
                <img src="media/images/logo.png" style={{ width: "50px" }} alt="Logo" />
                EQUINEX
            </a>

            <button 
                className="navbar-toggler" 
                type="button" 
                onClick={toggleNavbar}
                aria-controls="navbarNav" 
                aria-expanded={navbarOpen} 
                aria-label="Toggle navigation"
                style={{ border: "none" }}
            >
                <span className="navbar-toggler-icon" style={{ color: "white" }}>☰</span>
            </button>

            <div className={`collapse navbar-collapse ${navbarOpen ? "show" : ""}`} id="navbarNav">
                {/* Center Section: Search Bar */}
                <form className="d-flex align-items-center mx-auto" style={{ gap: "0.5rem" }}>
                    <input
                        className="form-control"
                        type="search"
                        placeholder="Search"
                        aria-label="Search"
                        style={{ width: "300px", backgroundColor: "white", borderRadius: "27px" }}
                    />
                    <button className="btn" type="submit" style={{ backgroundColor: '#96e856', color: 'black', height: '50px', justifyContent: 'center', borderRadius: "10px", padding: '9px', marginBottom: '5px' }}>
                        Search
                    </button>
                </form>

                {/* Right Section: Links */}
                <ul className="navbar-nav ml-auto d-flex align-items-center" style={{ gap: "1rem", marginBottom: 0 }}>
                    <li className="nav-item">
                        <Link className="nav-link active text-white" to="/chat">
                            Chats
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active text-white" to="/dashboard">
                            Dashboard
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active text-white" to="/news">
                            News
                        </Link>
                    </li>
                    <li className="nav-item">
                        <Link className="nav-link active text-white" to="/about">
                            About
                        </Link>
                    </li>

                    {!userData ? (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link active text-white" to="/signup">
                                    SignUp
                                </Link>
                            </li>
                            <li className="nav-item">
                                <Link className="nav-link active text-white" to="/login">
                                    Login
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li className="nav-item">
                                <Link className="nav-link active text-white" to="/logout" onClick={handleLogout}>
                                    Logout
                                </Link>
                            </li>
                            <li className="nav-item dropdown">
                                <button
                                    className="btn nav-link active text-white"
                                    onClick={toggleDropdown}
                                    style={{ backgroundColor: "transparent", border: "none" }}
                                >
                                    <i className="fas fa-user fa-lg text-white"></i>
                                </button>
                                {/* Conditionally render dropdown */}
                                {dropdownOpen && (
                                    <ul
                                        className="dropdown-menu show"
                                        style={{
                                            display: "block",
                                            position: "absolute",
                                            top: "60px",
                                            right: "10px",
                                            backgroundColor: "#333",
                                            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                                            color: "white",
                                            borderRadius: "5px",
                                            minWidth: "150px",
                                            padding: "10px",
                                            zIndex: 1000
                                        }}
                                    >
                                        <li>
                                            <Link className="dropdown-item" to="/profile" style={{ color: "white" }}>
                                                Profile
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/chat" style={{ color: "white" }}>
                                                Chats
                                            </Link>
                                        </li>
                                        <li>
                                            <Link className="dropdown-item" to="/video" style={{ color: "white" }}>
                                                Video Call
                                            </Link>
                                        </li>
                                    </ul>
                                )}
                            </li>
                        </>
                    )}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar;
