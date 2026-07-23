import "./App.css";

import Nav from "./components/Nav";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile/Profile";
import StartCampaign from "./components/StartCampaign";
import CreateCampaign from "./components/CreateCampaign";
import Campaigns from "./components/Campaigns";
import CampaignDetails from "./components/CampaignDetails";
import VerifyOTP from "./components/VerifyOTP";
import Donate from "./components/Donate";

import {
    Routes,
    Route,
    useLocation,
    Navigate
} from "react-router-dom";

function App() {
    const location = useLocation();
    const token = localStorage.getItem("token");

    // Hide navbar on these exact pages
    const hideNavPages = [
        "/login",
        "/register",
        "/profile"
    ];

    // Support both donation URL formats
    const isDonatePage =
        /^\/campaign\/[^/]+\/donate$/.test(
            location.pathname
        ) ||
        /^\/donate\/[^/]+$/.test(
            location.pathname
        );

    const hideNav =
        hideNavPages.includes(location.pathname) ||
        isDonatePage;

    return (
        <>
            {!hideNav && <Nav />}

            <Routes>

                <Route
                    path="/"
                    element={
                        token
                            ? (
                                <Navigate
                                    to="/profile"
                                    replace
                                />
                            )
                            : <Home />
                    }
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />

                <Route
                    path="/start-campaign"
                    element={<StartCampaign />}
                />

                <Route
                    path="/create-campaign"
                    element={<CreateCampaign />}
                />

                <Route
                    path="/campaigns"
                    element={<Campaigns />}
                />

                <Route
                    path="/verify-otp"
                    element={<VerifyOTP />}
                />


                {/* Donation routes */}

                <Route
                    path="/campaign/:id/donate"
                    element={<Donate />}
                />

                {/* Support old donation URL */}
                <Route
                    path="/donate/:id"
                    element={<Donate />}
                />


                {/* Keep this after donation route */}

                <Route
                    path="/campaign/:id"
                    element={<CampaignDetails />}
                />


                {/* Unknown route */}

                <Route
                    path="*"
                    element={
                        <Navigate
                            to="/"
                            replace
                        />
                    }
                />

            </Routes>
        </>
    );
}

export default App;