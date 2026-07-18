import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../config/api";
import "./CampaignSetup.css";

export default function CampaignSetup() {
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        full_name: "",
        phone_number: "",
        address: ""
    });

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }

    function nextStep() {
        if (
            !form.full_name ||
            !form.phone_number ||
            !form.address
        ) {
            setMessage("Please fill all the fields");
            return;
        }

        setMessage("");
        setStep(2);
    }

    async function handleVerification() {
        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/verification/mock-digilocker`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify(form)
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message || "Verification failed"
                );
                return;
            }

            // Setup completed
            navigate("/create-campaign");

        } catch (error) {
            console.error(error);

            setMessage(
                "Unable to complete verification"
            );

        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="campaign-setup">

            <div className="setup-container">

                <h1>Creator Setup</h1>

                <p className="setup-description">
                    Complete this one-time setup before
                    creating your first campaign.
                </p>


                {step === 1 && (
                    <div className="setup-step">

                        <h2>Personal Details</h2>

                        <input
                            type="text"
                            name="full_name"
                            placeholder="Full name"
                            value={form.full_name}
                            onChange={handleChange}
                        />

                        <input
                            type="tel"
                            name="phone_number"
                            placeholder="Phone number"
                            value={form.phone_number}
                            onChange={handleChange}
                        />

                        <textarea
                            name="address"
                            placeholder="Address"
                            value={form.address}
                            onChange={handleChange}
                        />

                        <button onClick={nextStep}>
                            Continue
                        </button>

                    </div>
                )}


                {step === 2 && (
                    <div className="setup-step">

                        <h2>Identity Verification</h2>

                        <p>
                            Verify your identity before
                            creating fundraising campaigns.
                        </p>

                        <div className="setup-summary">

                            <p>
                                <strong>Name:</strong>{" "}
                                {form.full_name}
                            </p>

                            <p>
                                <strong>Phone:</strong>{" "}
                                {form.phone_number}
                            </p>

                        </div>

                        <div className="setup-buttons">

                            <button
                                onClick={() => setStep(1)}
                            >
                                Back
                            </button>

                            <button
                                onClick={handleVerification}
                                disabled={loading}
                            >
                                {loading
                                    ? "Verifying..."
                                    : "Verify Identity"}
                            </button>

                        </div>

                    </div>
                )}


                {message && (
                    <p className="setup-message">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}