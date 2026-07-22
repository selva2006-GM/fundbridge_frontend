import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import API_URL from "../config/api";
import "./CampaignDetails.css";

export default function CampaignDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchCampaign() {
            try {
                setLoading(true);

                const response = await fetch(
                    `${API_URL}/api/campaigns/${id}`
                );

                if (!response.ok) {
                    throw new Error("Campaign not found");
                }

                const data = await response.json();

                setCampaign(data.campaign);

            } catch (error) {
                console.error(
                    "CAMPAIGN FETCH ERROR:",
                    error
                );

                setError("Unable to load campaign.");

            } finally {
                setLoading(false);
            }
        }

        fetchCampaign();
    }, [id]);

    if (loading) {
        return <p>Loading campaign...</p>;
    }

    if (error || !campaign) {
        return <p>{error || "Campaign not found."}</p>;
    }

    return (
        <main className="campaign-details">

            {campaign.image_url && (
                <img
                    src={campaign.image_url}
                    alt={campaign.title}
                />
            )}

            <span>{campaign.category}</span>

            <h1>{campaign.title}</h1>

            <p>{campaign.description}</p>

            <h3>
                ₹{Number(
                    campaign.raised_amount || 0
                ).toLocaleString("en-IN")}
                {" "}raised of{" "}
                ₹{Number(
                    campaign.goal_amount || 0
                ).toLocaleString("en-IN")}
            </h3>

            <button
                onClick={() =>
                    navigate(`/donate/${campaign.id}`)
                }
            >
                Donate Now
            </button>

        </main>
    );
}