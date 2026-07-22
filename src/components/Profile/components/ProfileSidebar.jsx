import { useState } from "react";
import { useNavigate } from "react-router-dom";

import "./ProfileSidebar.css";

export default function ProfileSidebar({
    user,
    activePage,
    setActivePage
}) {
    const navigate = useNavigate();
    const [collapsed, setCollapsed] = useState(false);

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    const menu = [
        { name: "Dashboard", page: "dashboard" },
        { name: "Explore Campaigns", page: "explore" },
        { name: "Start a Campaign", page: "create-campaign" },
        { name: "My Campaigns", page: "my-campaigns" },
        { name: "Donations", page: "donations" },
        { name: "Settings", page: "settings" }
    ];

    return (
        <aside
            className={`profile-sidebar ${
                collapsed ? "collapsed" : ""
            }`}
        >
            {/* Collapse button */}
            <button
                type="button"
                className="sidebar-toggle"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={
                    collapsed
                        ? "Expand sidebar"
                        : "Collapse sidebar"
                }
            >
                {collapsed ? "→" : "←"}
            </button>

            <div className="profile-user">
                <div className="profile-avatar">
                    {user?.username
                        ?.charAt(0)
                        .toUpperCase()}
                </div>

                <div className="profile-user-details">
                    <h3>{user?.username}</h3>
                    <p>{user?.email}</p>
                </div>
            </div>

            <nav className="profile-menu">
                {menu.map((item) => (
                    <button
                        key={item.page}
                        className={
                            activePage === item.page
                                ? "active"
                                : ""
                        }
                        onClick={() =>
                            setActivePage(item.page)
                        }
                        title={
                            collapsed
                                ? item.name
                                : undefined
                        }
                    >
                        <span className="menu-name">
                            {item.name}
                        </span>
                    </button>
                ))}
            </nav>

            <div className="sidebar-bottom">
                <button
                    className="profile-logout"
                    onClick={handleLogout}
                    title={
                        collapsed
                            ? "Logout"
                            : undefined
                    }
                >
                    <span className="logout-text">
                        Logout
                    </span>
                </button>
            </div>
        </aside>
    );
}