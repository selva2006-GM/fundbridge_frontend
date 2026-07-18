import { useNavigate } from "react-router-dom";

export default function ProfileSidebar({
    user,
    activePage,
    setActivePage
}) {
    const navigate = useNavigate();

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
    }

    const menu = [
        {
            name: "Dashboard",
            page: "dashboard"
        },
        {
            name: "Explore Campaigns",
            page: "explore"
        },
        {
            name: "Start a Campaign",
            page: "create-campaign"
        },
        {
            name: "My Campaigns",
            page: "my-campaigns"
        },
        {
            name: "Donations",
            page: "donations"
        },
        {
            name: "Settings",
            page: "settings"
        }
    ];

    return (
        <aside className="profile-sidebar">

            <div className="profile-user">

                <div className="profile-avatar">
                    {user?.username
                        ?.charAt(0)
                        .toUpperCase()}
                </div>

                <div>
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
                    >
                        {item.name}
                    </button>
                ))}

            </nav>

            <div className="sidebar-bottom">
                <button
                    className="profile-logout"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </aside>
    );
}