import CampaignCard from "../../CampaignCard";
import API_URL from "../../../config/api";

import "./MyCampaigns.css";

export default function MyCampaigns({
    campaigns = [],
    setCampaigns,
    setActivePage,
    setSelectedCampaignId
}) {

    async function handleDelete(campaignId) {

        const confirmed = window.confirm(
            "Are you sure you want to remove this campaign?"
        );

        if (!confirmed) return;

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                `${API_URL}/api/campaigns/${campaignId}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to delete campaign"
                );
            }

            // Remove campaign immediately from UI
            setCampaigns((currentCampaigns) =>
                currentCampaigns.filter(
                    (campaign) =>
                        campaign.id !== campaignId
                )
            );

        } catch (error) {

            console.error(
                "DELETE CAMPAIGN ERROR:",
                error
            );

            alert(error.message);
        }
    }


    return (
        <div className="profile-page-content">

            <div className="profile-header">

                <div>
                    <h2>My Campaigns</h2>

                    <p>
                        Manage all your fundraising campaigns.
                    </p>
                </div>

                <button
                    className="create-campaign-button"
                    onClick={() =>
                        setActivePage("create-campaign")
                    }
                >
                    + New Campaign
                </button>

            </div>


            {campaigns.length === 0 ? (

                <div className="empty-campaigns">

                    <h3>No campaigns yet</h3>

                    <p>
                        You haven't created any campaigns yet.
                    </p>

                </div>

            ) : (

                <div className="profile-campaign-grid">

                    {campaigns.map((campaign) => (

                        <div
                            className="my-campaign-item"
                            key={campaign.id}
                        >

                            <CampaignCard
                                campaign={campaign}
                                showDonate={false}
                            />

                            <div className="campaign-manage-actions">

                            <button
                                className="edit-campaign-btn"
                                onClick={() => {
                                    setSelectedCampaignId(campaign.id);
                                    setActivePage("edit-campaign");
                                }}
                            >
                                Edit
                            </button>

                                <button
                                    className="remove-campaign-btn"
                                    onClick={() =>
                                        handleDelete(campaign.id)
                                    }
                                >
                                    Remove
                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}