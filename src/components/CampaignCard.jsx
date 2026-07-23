import { useNavigate } from "react-router-dom";
import "./CampaignCard.css";

export default function CampaignCard({
    campaign,
    showDonate = true,
    showEdit = false,
    onEdit = () => {}
}) {

    const navigate = useNavigate();

    const isEnded =
    campaign.end_date &&
    new Date(campaign.end_date) < new Date();

    function handleDonate(e) {
        e.stopPropagation();
        navigate(`/campaign/${campaign.id}/donate`);
    }
    
    function handleOpenCampaign() {
        navigate(`/campaign/${campaign.id}`);
    }

    return (
        <div className="campaign-card" onClick={handleOpenCampaign}
            style={{ cursor: "pointer" }}
        >

            {campaign.image_url && (
                <img
                    src={campaign.image_url}
                    alt={campaign.title}
                    className="campaign-image"
                />
            )}

            <div className="campaign-content">

                <span className="campaign-category">
                    {campaign.category}
                </span>

                <h3>
                    {campaign.title}
                </h3>

                <p>
                    {campaign.description}
                </p>

                <p>
                    By:{" "}
                    <strong>
                        {campaign.username}
                    </strong>
                </p>


                <div className="campaign-progress">

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

{/* EDIT BUTTON */}
{showEdit && (
    <button
        className="edit-campaign-btn"
        onClick={(e) => {
            e.stopPropagation();
            onEdit(campaign.id);
        }}
    >
        Edit Campaign
    </button>
)}

{showDonate && (
    isEnded ? (
        <div className="campaign-ended">
            Campaign Ended
        </div>
    ) : (
        <button
            className="donate-button"
            onClick={handleDonate}
        >
            Donate
        </button>
    )
)}

            </div>

        </div>
    );
}