import { useState } from "react";
import API_URL from "../../../config/api";

import "./EditPayout.css";

export default function EditPayout({
    setActivePage
}) {
    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


        const [razorpayAccountId, setRazorpayAccountId] =
        useState("");
    
    async function handleConnect() {
        const token = localStorage.getItem("token");
    
        if (!token) {
            setError("Please log in to continue.");
            return;
        }
    
        if (!razorpayAccountId.trim()) {
            setError("Please enter your Razorpay Account ID.");
            return;
        }
    
        try {
            setLoading(true);
            setError("");
    
            const response = await fetch(
                `${API_URL}/api/payout`,
                {
                    method: "PUT",
    
                    headers: {
                        "Content-Type":
                            "application/json",
    
                        Authorization:
                            `Bearer ${token}`
                    },
    
                    body: JSON.stringify({
                        razorpay_account_id:
                            razorpayAccountId.trim(),
    
                        razorpay_account_status:
                            "connected"
                    })
                }
            );
    
            const data = await response.json();
    
            if (!response.ok) {
                setError(
                    data.message ||
                    "Unable to connect payout account."
                );
                return;
            }
    
            setActivePage("payout");
    
        } catch (error) {
            console.error(
                "PAYOUT CONNECTION ERROR:",
                error
            );
    
            setError(
                "Unable to connect to the server."
            );
    
        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="edit-payout-page">

            <div className="profile-header">

                <div>
                    <h2>
                        Set Up Payout Account
                    </h2>

                    <p>
                        Connect your payout account
                        to receive funds raised through
                        your campaigns.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() =>
                        setActivePage("payout")
                    }
                >
                    Back
                </button>

            </div>


            <div className="edit-payout-form">

                <div className="payout-connect-section">

                    <div className="payout-connect-icon">
                        ₹
                    </div>

                    <h3>
                        Connect Your Payout Account
                    </h3>

                    <p>
                        Complete the secure payout
                        onboarding process to receive
                        funds from your campaigns.
                    </p>


                    <div className="payout-security-notice">

                        <span className="security-icon">
                            🔒
                        </span>

                        <div>
                            <strong>
                                Secure payout setup
                            </strong>

                            <p>
                                Your payout and verification
                                information will be handled
                                through the payment provider's
                                onboarding process.
                            </p>
                        </div>

                    </div>


                    {error && (
                        <p className="payout-error">
                            {error}
                        </p>
                    )}


                    <div className="payout-account-input">
                        <label>
                            Razorpay Account ID
                        </label>

                        <input
                            type="text"
                            placeholder="acc_xxxxxxxxxxxxxx"
                            value={razorpayAccountId}
                            onChange={(e) =>
                                setRazorpayAccountId(e.target.value)
                            }
                        />

                        <small>
                            Enter your Razorpay linked account ID.
                        </small>
                    </div>

                    <button
                        type="button"
                        className="connect-payout-button"
                        onClick={handleConnect}
                        disabled={loading}
                    >
                        {loading
                            ? "Connecting..."
                            : "Connect Payout Account"
                        }
                    </button>

                </div>

            </div>

        </div>
    );
}