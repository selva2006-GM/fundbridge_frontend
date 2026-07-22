import { useEffect, useState } from "react";
import API_URL from "../../../config/api";
import "./Donations.css";
export default function Donations() {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchDonations() {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `${API_URL}/api/donations/my-donations`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                console.log("Donations:", data);

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to fetch donations"
                    );
                }

                setDonations(data);

            } catch (error) {
                console.error(
                    "DONATIONS FETCH ERROR:",
                    error
                );
            } finally {
                setLoading(false);
            }
        }

        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="profile-page-content">
                <p>Loading donations...</p>
            </div>
        );
    }

    return (
        <div className="profile-page-content">

            <div className="profile-header">
                <div>
                    <h2>My Donations</h2>
                    <p>View campaigns you have supported.</p>
                </div>
            </div>

            {donations.length === 0 ? (

                <div className="empty-campaigns">
                    <h3>No donations yet</h3>
                    <p>
                        Campaigns you support will appear here.
                    </p>
                </div>

            ) : (

                <div className="donations-list">

                    {donations.map((donation) => (

<div
className="donation-item"
key={donation.id}
>
<div className="donation-info">

    <h3>
        {donation.campaign_title || "Campaign"}
    </h3>

    <div className="donation-meta">
        <span>
            Donation ID: #{donation.id}
        </span>

        <span>
            Campaign ID: #{donation.campaign_id}
        </span>

        <span>
            {donation.created_at
                ? new Date(
                    donation.created_at
                ).toLocaleDateString(
                    "en-IN",
                    {
                        day: "2-digit",
                        month: "short",
                        year: "numeric"
                    }
                )
                : "Date unavailable"}
        </span>
    </div>

    <span
        className={`donation-status ${donation.payment_status}`}
    >
        {donation.payment_status}
    </span>

</div>

<strong className="donation-amount">
    ₹{Number(
        donation.amount
    ).toLocaleString("en-IN")}
</strong>
</div>
                    ))}

                </div>
            )}

        </div>
    );
}