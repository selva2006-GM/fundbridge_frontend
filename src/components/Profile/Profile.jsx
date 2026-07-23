import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../../config/api";
import ProfileSidebar from "./components/ProfileSidebar";

import Dashboard from "./pages/Dashboard";
import MyCampaigns from "./pages/MyCampaigns";
import Donations from "./pages/Donations";
import Settings from "./pages/Settings";
import PayoutDetails from "./pages/PayoutDetails";
import Campaigns from "../Campaigns";
import CreateCampaign from "../CreateCampaign";
import EditCampaign from "./pages/EditCampaign";
import EditPayout from "./pages/EditPayout";
import VerifyPayout from "./pages/VerifyPayout";
import ChangePassword from "./pages/ChangePassword";
import DeleteAccount from "./pages/DeleteAccount";
import "./Profile.css";

export default function Profile() {
    const navigate = useNavigate();

    const [activePage, setActivePage] =
        useState("dashboard");

    const [user, setUser] = useState(null);
    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);

    const [payoutConnected, setPayoutConnected] =
        useState(false);

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
    
            const token =
                localStorage.getItem("token");
    
            if (!token) {
                navigate("/login");
                return;
            }
    
            try {
    
                const response = await fetch(
                    `${API_URL}/profile`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );
    
                const data =
                    await response.json();
    
                if (!response.ok) {
                    localStorage.removeItem("token");
                    navigate("/login");
                    return;
                }
    
                setUser(data.user);
            } catch (error) {
    
                console.error(
                    "Profile fetch error:",
                    error
                );
    
            } finally {
    
                setLoading(false);
    
            }
        }
    
    
        async function fetchPayoutStatus() {
    
            const token =
                localStorage.getItem("token");
    
            if (!token) {
                return;
            }
    
            try {
    
                const response = await fetch(
                    `${API_URL}/api/payout`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );
    
                const data =
                    await response.json();
    
                if (!response.ok) {
                    return;
                }
    
    
                const connected =
                    Boolean(
                        data.payout
                            ?.razorpay_account_id
                    ) &&
                    data.payout
                        ?.razorpay_account_status ===
                        "connected";
    
    
                setPayoutConnected(
                    connected
                );
    
    
            } catch (error) {
    
                console.error(
                    "Payout status error:",
                    error
                );
    
            }
        }
    
    
        fetchProfile();
    
        fetchMyCampaigns();
    
        fetchPayoutStatus();
    
    
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
            {!payoutConnected && (
                    <div className="payout-reminder">

                        <div>
                            <strong>
                                Complete your payout setup
                            </strong>

                            <p>
                                Your campaigns will not be publicly
                                visible or able to receive donations
                                until you connect a payout account.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                setActivePage("payout")
                            }
                        >
                            Set Up Payout
                        </button>

                    </div>
                )}

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


                {activePage === "change-password" && (
                    <ChangePassword
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

    


                {activePage === "payout" && (
                    <PayoutDetails
                        setActivePage={setActivePage}
                    />
                )}

                {activePage === "edit-payout" && (
                    <EditPayout
                        setActivePage={setActivePage}
                    />
                )}
                {activePage === "delete-account" && (
                    <DeleteAccount
                        setActivePage={setActivePage}
                    />
                )}
                

            </main>

        </div>
    );
}