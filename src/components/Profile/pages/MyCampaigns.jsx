import MyCampaignCard from "../components/MyCampaignCard";
import API_URL from "../../../config/api";

export default function MyCampaigns({
    campaigns = [],
    setCampaigns,
    setActivePage,
    setSelectedCampaignId
}) {

    function handleEdit(campaignId) {
        setSelectedCampaignId(campaignId);
        setActivePage("edit-campaign");
    }

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

            setCampaigns((current) =>
                current.filter(
                    (campaign) =>
                        campaign.id !== campaignId
                )
            );

        } catch (error) {
            console.error(error);
            alert(error.message);
        }
    }

    return (
        <div className="profile-page-content">

            <h2>My Campaigns</h2>

            <div className="profile-campaign-grid">

                {campaigns.map((campaign) => (
                    <MyCampaignCard
                        key={campaign.id}
                        campaign={campaign}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                    />
                ))}

            </div>

        </div>
    );
}