import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

import "./Nav.css";

export default function Nav() {
    const navigate = useNavigate();
    const location = useLocation();

    const token = localStorage.getItem("token");
    const isLoggedIn = !!token;

    const isProfilePage =
        location.pathname === "/profile";

    function handleStartCampaign() {
        if (!isLoggedIn) {
            navigate("/register");
            return;
        }

        navigate("/start-campaign");
    }

    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/");
        window.location.reload();
    }

    return (
        <nav className="navbar">

            <div
                className="nav-logo"
                onClick={() => navigate("/")}
            >
                <img
                    src={logo}
                    alt="FundBridge Logo"
                    className="nav-logo-image"
                />

                <span>FundBridge</span>
            </div>

            {!isProfilePage && (
                <div className="nav-links">

                    <button onClick={() => navigate("/")}>
                        Home
                    </button>

                    <button
                        onClick={() => navigate("/campaigns")}
                    >
                        Campaigns
                    </button>

                    <button
                        className="start-campaign-btn"
                        onClick={handleStartCampaign}
                    >
                        Start a Campaign
                    </button>

                    {isLoggedIn ? (
                        <>
                            <button
                                onClick={() =>
                                    navigate("/profile")
                                }
                            >
                                Profile
                            </button>

                            <button onClick={handleLogout}>
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() =>
                                    navigate("/login")
                                }
                            >
                                Login
                            </button>

                            <button
                                onClick={() =>
                                    navigate("/register")
                                }
                            >
                                Register
                            </button>
                        </>
                    )}

                </div>
            )}

        </nav>
    );
}