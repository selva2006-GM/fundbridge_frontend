import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../../config/api";
import ProfileSidebar from "./ProfileSidebar";

import Dashboard from "./pages/Dashboard";
import MyCampaigns from "./pages/MyCampaigns";
import Donations from "./pages/Donations";
import Settings from "./pages/Settings";
import PayoutDetails from "./pages/PayoutDetails";
import Campaigns from "../Campaigns";
import CreateCampaign from "../CreateCampaign";
import EditCampaign from "./EditCampaign";

import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();

    const [activePage, setActivePage] = useState("dashboard");


    const [user, setUser] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedCampaignId, setSelectedCampaignId] =
        useState(null);

    async function fetchMyCampaigns() {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(
                `${API_URL}/api/campaigns/my`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to fetch campaigns"
                );
            }

            console.log("MY CAMPAIGNS:", data.campaigns);

            setCampaigns(data.campaigns || []);

        } catch (error) {
            console.error(
                "FETCH MY CAMPAIGNS ERROR:",
                error
            );
        }
    }

    useEffect(() => {
        async function fetchProfile() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/profile`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }

                setUser(data.user);
                setCampaigns(data.campaigns || []);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
        fetchMyCampaigns();
    }, [navigate]);

    if (loading) {
        return <p>Loading profile...</p>;
    }

    return (
        <div className="profile-layout">

            <ProfileSidebar
                user={user}
                activePage={activePage}
                setActivePage={setActivePage}
            />

            <main className="profile-main">

                {activePage === "dashboard" && (
                    <Dashboard
                        user={user}
                        campaigns={campaigns}
                        setActivePage={setActivePage}
                    />
                )}

                {activePage === "explore" && (
                    <Campaigns />
                )}

                {activePage === "create-campaign" && (
                    <CreateCampaign
                        onCancel={() =>
                            setActivePage("dashboard")
                        }
                        onSuccess={async () => {
                            await fetchMyCampaigns();
                            setActivePage("my-campaigns");
                        }}
                    />
                )}

                {activePage === "my-campaigns" && (
                    <MyCampaigns
                        campaigns={campaigns}
                        setCampaigns={setCampaigns}
                        setActivePage={setActivePage}
                        setSelectedCampaignId={setSelectedCampaignId}
                    />
                )}

                {activePage === "donations" && (
                    <Donations />
                )}

                {activePage === "settings" && (
                    <Settings
                        user={user}
                        setUser={setUser}
                        setActivePage={setActivePage}
                    />
                )}

                    {activePage === "edit-campaign" && (
                        <EditCampaign
                            campaignId={selectedCampaignId}
                            setActivePage={setActivePage}
                            setCampaigns={setCampaigns}
                        />
                    )}

                {activePage === "verify-payout" && (
                    <VerifyPayout
                        setActivePage={setActivePage}
                    />
                )}

                {activePage === "edit-campaign" && (
                    <EditCampaign
                        campaignId={selectedCampaignId}
                        setActivePage={setActivePage}
                        setCampaigns={setCampaigns}
                    />
                )}


                {activePage === "payout" && (
                    <PayoutDetails
                        setActivePage={setActivePage}
                    />
                )}

            </main>

        </div>
    );
}