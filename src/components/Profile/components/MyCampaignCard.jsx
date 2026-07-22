import "./MyCampaignCard.css";

export default function MyCampaignCard({
    campaign,
    onEdit,
    onDelete
}) {
    return (
        <div className="my-campaign-card">

            {campaign.image_url && (
                <img
                    src={campaign.image_url}
                    alt={campaign.title}
                    className="my-campaign-card-image"
                />
            )}

            <div className="my-campaign-card-content">

                <span className="my-campaign-card-category">
                    {campaign.category}
                </span>

                <h2>{campaign.title}</h2>

                <p className="my-campaign-card-description">
                    {campaign.description}
                </p>

                <div className="my-campaign-card-progress-info">
                    <p>
                        Raised: ₹
                        {Number(
                            campaign.raised_amount || 0
                        ).toLocaleString()}
                    </p>

                    <p>
                        Goal: ₹
                        {Number(
                            campaign.goal_amount || 0
                        ).toLocaleString()}
                    </p>
                </div>

                <progress
                    value={Number(
                        campaign.raised_amount || 0
                    )}
                    max={Number(
                        campaign.goal_amount || 1
                    )}
                />

                <div className="my-campaign-card-actions">
                    <button
                        className="my-campaign-edit-btn"
                        onClick={() =>
                            onEdit(campaign.id)
                        }
                    >
                        Edit Campaign
                    </button>

                    <button
                        className="my-campaign-remove-btn"
                        onClick={() =>
                            onDelete(campaign.id)
                        }
                    >
                        Remove
                    </button>
                </div>

            </div>
        </div>
    );
}