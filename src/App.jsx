import "./App.css";

import Nav from "./components/Nav";
import Home from "./components/Home";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile/Profile";
import StartCampaign from "./components/StartCampaign";
import CampaignSetup from "./components/CampaignSetup";
import CreateCampaign from "./components/CreateCampaign";
import Campaigns from "./components/Campaigns";
import VerifyOTP from "./components/VerifyOTP";
import Donate from "./components/Donate";

import { Routes, Route, useLocation } from "react-router-dom";


function App() {

    const location = useLocation();

    const hideNavPages = [
        "/login",
        "/register",
        "/profile"
    ];

    const hideNav =
        hideNavPages.includes(location.pathname);

    return (
        <>
            {!hideNav && <Nav />}

            <Routes>

                <Route
                    path="/"
                    element={<Home />}
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
                    path="/campaign-setup"
                    element={<CampaignSetup />}
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

                <Route
                    path="/campaign/:id/donate"
                    element={<Donate />}
                />

            </Routes>
        </>
    );
}

export default App;