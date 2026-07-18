import { useEffect, useState } from "react";
import {
    useNavigate,
    useParams
} from "react-router-dom";

import API_URL from "../config/api";
import "./Donate.css";

export default function Donate() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [campaign, setCampaign] = useState(null);
    const [amount, setAmount] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {
        async function fetchDetails() {
            try {
                setError("");

                const response = await fetch(
                    `${API_URL}/api/campaigns/${id}/donation-details`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Unable to load donation details"
                    );
                }

                setCampaign(data.campaign);

            } catch (error) {
                console.error(
                    "Donation fetch error:",
                    error
                );

                setError(error.message);

            } finally {
                setLoading(false);
            }
        }

        fetchDetails();

    }, [id]);


    function handlePayment() {
        const donationAmount = Number(amount);

        if (
            !donationAmount ||
            donationAmount <= 0
        ) {
            setError(
                "Please enter a valid donation amount"
            );

            return;
        }

        const upiUrl =
            `upi://pay?pa=${encodeURIComponent(
                campaign.upi_id
            )}` +
            `&pn=${encodeURIComponent(
                campaign.account_holder_name
            )}` +
            `&am=${donationAmount}` +
            `&cu=INR` +
            `&tn=${encodeURIComponent(
                `Donation for ${campaign.title}`
            )}`;

        window.location.href = upiUrl;
    }


    if (loading) {
        return (
            <div className="donate-page">
                <p>Loading donation details...</p>
            </div>
        );
    }


    if (!campaign) {
        return (
            <div className="donate-page">

                <p>
                    {error ||
                        "Unable to load donation details."}
                </p>

                <button
                    onClick={() => navigate(-1)}
                >
                    ← Go Back
                </button>

            </div>
        );
    }


    return (
        <div className="donate-page">

            <button
                className="donate-back"
                onClick={() => navigate(-1)}
            >
                ← Back
            </button>


            <div className="donate-container">

                <div className="donate-header">

                    <span>
                        {campaign.category}
                    </span>

                    <h1>
                        Support this Campaign
                    </h1>

                    <h2>
                        {campaign.title}
                    </h2>

                </div>


                <div className="donate-progress">

                    <div>
                        <span>Raised</span>

                        <strong>
                            ₹
                            {Number(
                                campaign.raised_amount || 0
                            ).toLocaleString()}
                        </strong>
                    </div>

                    <div>
                        <span>Goal</span>

                        <strong>
                            ₹
                            {Number(
                                campaign.goal_amount || 0
                            ).toLocaleString()}
                        </strong>
                    </div>

                </div>


                <div className="donation-amount">

                    <label>
                        Donation Amount
                    </label>

                    <div className="amount-input">

                        <span>₹</span>

                        <input
                            type="number"
                            placeholder="Enter amount"
                            value={amount}
                            min="1"

                            onChange={(e) => {
                                setAmount(
                                    e.target.value
                                );

                                setError("");
                            }}
                        />

                    </div>


                    <div className="quick-amounts">

                        {[100, 500, 1000, 5000].map(
                            (value) => (

                                <button
                                    type="button"
                                    key={value}
                                    onClick={() =>
                                        setAmount(
                                            value.toString()
                                        )
                                    }
                                >
                                    ₹{value.toLocaleString()}
                                </button>

                            )
                        )}

                    </div>

                </div>


                {campaign.upi_id ? (

                    <div className="donation-method">

                        <h3>
                            Pay securely using UPI
                        </h3>

                        <p>
                            Your payment will be sent to
                            the campaign recipient.
                        </p>


                        <button
                            className="pay-button"
                            onClick={handlePayment}
                            disabled={
                                !amount ||
                                Number(amount) <= 0
                            }
                        >
                            Donate ₹
                            {Number(
                                amount || 0
                            ).toLocaleString()}
                        </button>

                    </div>

                ) : (

                    <div className="no-payout">

                        This campaign does not have
                        payout details configured yet.

                    </div>

                )}


                {error && (
                    <p className="donation-error">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}