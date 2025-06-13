import React from "react";
import SidebarNav from "./SidebarNav";
import { Link } from "react-router-dom";
import "../Styles/Pages.css";

const NotFound = () => (
    <div className="dashboard-root">
        <SidebarNav />
        <main className="dashboard-main">
            <div className="page-card" style={{ textAlign: "center", minHeight: 400, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
                <img 
                    src="/Logo.jpeg"
                    alt="Steam and Friends Logo"
                    style={{ 
                        width: 80, 
                        marginBottom: 24, 
                        filter: "drop-shadow(0 0 24px #00ffe7aa)",
                        borderRadius: "30%",
                        objectFit: "cover"
                    }}
                />
                <h1 style={{ fontSize: "2.8rem", color: "#00ffe7", marginBottom: 12 }}>404</h1>
                <h2 style={{ color: "#7fffd4", marginBottom: 24 }}>Page Not Found</h2>
                <p style={{ color: "#e0e6f0", marginBottom: 32 }}>
                    Oops! The page you’re looking for doesn’t exist.<br />
                    Maybe you followed a broken link or mistyped the address.
                </p>
                <Link to="/dashboard" className="btn" style={{ fontSize: "1.1rem", padding: "12px 32px" }}>
                    Go to Dashboard
                </Link>
            </div>
        </main>
    </div>
);

export default NotFound;