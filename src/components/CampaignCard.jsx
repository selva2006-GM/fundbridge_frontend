import { useNavigate } from "react-router-dom";
import "./CampaignCard.css";

export default function CampaignCard({ campaign }) {

    const navigate = useNavigate();

    const isEnded =
    campaign.end_date &&
    new Date(campaign.end_date) < new Date();

    function handleDonate() {
        navigate(`/campaign/${campaign.id}/donate`);
    }

    return (
        <div className="campaign-card">

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


                {isEnded ? (
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
                )}

            </div>

        </div>
    );
}