import CampaignCard from "../../CampaignCard";

export default function MyCampaigns({
    campaigns = [],
    setActivePage
}) {
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

                    <button
                        onClick={() =>
                            setActivePage("create-campaign")
                        }
                    >
                        Start a Campaign
                    </button>

                </div>
            ) : (
                <div className="profile-campaign-grid">

                    {campaigns.map((campaign) => (
                        <CampaignCard
                            key={campaign.id}
                            campaign={campaign}
                        />
                    ))}

                </div>
            )}

        </div>
    );
}