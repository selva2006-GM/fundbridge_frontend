import CampaignCard from "../../CampaignCard";

export default function Dashboard({
    user,
    campaigns,
    setActivePage
}) {
    const activeCampaigns = campaigns.filter((campaign) => {
        const endDate = new Date(campaign.end_date);
        const today = new Date();
    
        const raised = Number(campaign.raised_amount || 0);
        const goal = Number(campaign.goal_amount || 0);
    
        return (
            endDate >= today &&
            raised < goal
        );
    });

    const totalRaised = campaigns.reduce(
        (total, campaign) =>
            total + Number(campaign.raised_amount || 0),
        0
    );

    return (
        <>
            <header className="profile-header">

                <div>
                    <h2>Dashboard</h2>

                    <p>
                        Welcome back, {user?.username}.
                    </p>
                </div>

                <button
                    className="create-campaign-button"
                    onClick={() =>
                        setActivePage("create-campaign")
                    }
                >
                    + Start Campaign
                </button>

            </header>


            <section className="profile-overview">

                <div className="overview-card">
                    <span>Total Campaigns</span>
                    <strong>{campaigns.length}</strong>
                </div>

                <div className="overview-card">
                    <span>Active Campaigns</span>
                    <strong>{activeCampaigns.length}</strong>
                </div>

                <div className="overview-card">
                    <span>Total Raised</span>

                    <strong>
                        ₹{totalRaised.toLocaleString()}
                    </strong>
                </div>

            </section>


            <section className="profile-campaigns">

                <div className="section-heading">

                    <div>
                        <h2>My Campaigns</h2>

                        <p>
                            Manage and track your
                            fundraising campaigns.
                        </p>
                    </div>

                    {campaigns.length > 0 && (
                        <button
                            onClick={() =>
                                setActivePage("my-campaigns")
                            }
                        >
                            View All
                        </button>
                    )}

                </div>


                {campaigns.length === 0 ? (

                    <div className="empty-campaigns">

                        <h3>No campaigns yet</h3>

                        <p>
                            Start your first campaign
                            and begin raising support.
                        </p>

                        <button
                            onClick={() =>
                                setActivePage(
                                    "create-campaign"
                                )
                            }
                        >
                            Start a Campaign
                        </button>

                    </div>

                ) : (

                    <div className="profile-campaign-grid">

                        {campaigns
                            .slice(0, 3)
                            .map((campaign) => (

                                <CampaignCard
                                    key={campaign.id}
                                    campaign={campaign}
                                />

                            ))}

                    </div>

                )}

            </section>
        </>
    );
}