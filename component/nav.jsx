"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    console.log("Logout button clicked");

    localStorage.removeItem("isLoggedIn");

    router.push("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div className="library-logo">📖</div>
        <div className="library-title">
          <h1> Library Management</h1>
        </div>
      </div>
      <div className="admin-wrapper">
        <button
          className="admin-profile"
          onClick={() => setShowMenu(!showMenu)}
        >
          <span className="admin-avatar">A</span>
          <div className="admin-info">
            <strong>Admin</strong>
          </div>

          <span className="profile-arrow">{showMenu ? "⌃" : "⌄"}</span>
        </button>

        {showMenu && (
          <div className="admin-dropdown">
            <div className="dropdown-user"></div>

            <div className="dropdown-line"></div>

            <button className="logout-btn" onClick={handleLogout}>
              <span>↪</span>
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
