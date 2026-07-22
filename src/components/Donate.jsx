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

    async function handlePayment() {
        const donationAmount = Number(amount);
    
        if (!donationAmount || donationAmount <= 0) {
            setError(
                "Please enter a valid donation amount"
            );
            return;
        }
    
        try {
            setError("");
    
            // Load Razorpay only when Donate is clicked
            const loaded = await loadRazorpayScript();
    
            if (!loaded) {
                throw new Error(
                    "Payment service failed to load"
                );
            }
    
            // Create Razorpay order
            const response = await fetch(
                `${API_URL}/api/payments/create-order`,
                {
                    method: "POST",
    
                    headers: {
                        "Content-Type": "application/json"
                    },
    
                    body: JSON.stringify({
                        campaignId: campaign.id,
                        amount: donationAmount
                    })
                }
            );
    
            const order = await response.json();
    
            if (!response.ok) {
                throw new Error(
                    order.message ||
                    "Unable to create payment order"
                );
            }
    
            const options = {
                key: order.key,
                amount: order.amount,
                currency: order.currency,
                name: "FundBridge",
                description:
                    `Donation for ${campaign.title}`,
                order_id: order.orderId,
    
                handler: async function (
                    paymentResponse
                ) {
                    try {
                        const verifyResponse =
                            await fetch(
                                `${API_URL}/api/payments/verify`,
                                {
                                    method: "POST",
    
                                    headers: {
                                        "Content-Type":
                                            "application/json"
                                    },
    
                                    body: JSON.stringify(
                                        paymentResponse
                                    )
                                }
                            );
    
                        const verifyData =
                            await verifyResponse.json();
    
                        if (!verifyResponse.ok) {
                            throw new Error(
                                verifyData.message ||
                                "Payment verification failed"
                            );
                        }
    
                        alert(
                            "Thank you! Your donation was successful."
                        );
    
                        navigate(
                            `/campaign/${campaign.id}`
                        );
    
                    } catch (error) {
                        console.error(
                            "Payment verification error:",
                            error
                        );
    
                        setError(
                            "Payment completed, but verification failed."
                        );
                    }
                },
    
                modal: {
                    ondismiss: function () {
                        console.log(
                            "Payment window closed"
                        );
                    }
                },
    
                theme: {
                    color: "#2563eb"
                }
            };
    
            const razorpay =
                new window.Razorpay(options);
    
            razorpay.on(
                "payment.failed",
                function (response) {
                    console.error(
                        "Payment failed:",
                        response.error
                    );
    
                    setError(
                        response.error.description ||
                        "Payment failed. Please try again."
                    );
                }
            );
    
            razorpay.open();
    
        } catch (error) {
            console.error(
                "Payment error:",
                error
            );
    
            setError(
                error.message ||
                "Unable to start payment"
            );
        }
    }
    function loadRazorpayScript() {
        return new Promise((resolve) => {
            if (window.Razorpay) {
                resolve(true);
                return;
            }
    
            const script =
                document.createElement("script");
    
            script.src =
                "https://checkout.razorpay.com/v1/checkout.js";
    
            script.onload = () => resolve(true);
            script.onerror = () => resolve(false);
    
            document.body.appendChild(script);
        });
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


                <div className="donation-method">

                    <h3>
                        Pay securely with Razorpay
                    </h3>

                    <p>
                        Complete your donation securely
                        using the available payment methods.
                    </p>

                    <button
                        type="button"
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


                {error && (
                    <p className="donation-error">
                        {error}
                    </p>
                )}

            </div>

        </div>
    );
}