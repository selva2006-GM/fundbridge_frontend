import { useState } from "react";
import {
    useLocation,
    useNavigate
} from "react-router-dom";

import API_URL from "../config/api";

import "./VerifyOTP.css";
export default function VerifyOTP() {
    const navigate = useNavigate();
    const location = useLocation();

    const email =
        location.state?.email;

    const returnTo =
        location.state?.returnTo ||
        "/profile";

    const [otp, setOtp] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [loading, setLoading] =
        useState(false);


    async function handleSubmit(e) {
        e.preventDefault();

        if (!email) {
            setMessage(
                "Email information is missing. Please register again."
            );

            return;
        }


        if (otp.length !== 6) {
            setMessage(
                "Please enter the 6-digit OTP"
            );

            return;
        }


        try {
            setLoading(true);
            setMessage("");


            const response = await fetch(
                `${API_URL}/verify-registration`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({
                        email,
                        otp
                    })
                }
            );


            const data =
                await response.json();


            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Verification failed"
                );

                return;
            }


            // Email verified
            // User can now login

            navigate(
                "/login",
                {
                    state: {
                        returnTo,
                        email
                    }
                }
            );


        } catch (error) {

            console.error(
                "OTP verification error:",
                error
            );

            setMessage(
                "Unable to verify OTP"
            );

        } finally {

            setLoading(false);

        }
    }


    return (
        <div className="verify-otp-page">

            <form
                className="verify-otp-form"
                onSubmit={handleSubmit}
            >

                <h1>
                    Verify Your Email
                </h1>


                <p>
                    We sent a verification code to
                </p>


                <strong>
                    {email ||
                        "your email address"}
                </strong>


                <input
                    type="text"
                    inputMode="numeric"
                    maxLength="6"
                    placeholder="Enter 6-digit OTP"
                    value={otp}

                    onChange={(e) => {

                        const value =
                            e.target.value.replace(
                                /\D/g,
                                ""
                            );

                        setOtp(value);

                    }}

                    required
                />


                <button
                    type="submit"
                    disabled={
                        loading ||
                        otp.length !== 6
                    }
                >

                    {loading
                        ? "Verifying..."
                        : "Verify Email"
                    }

                </button>


                {message && (
                    <p>
                        {message}
                    </p>
                )}


                <button
                    type="button"
                    onClick={() =>
                        navigate("/register")
                    }
                >
                    ← Back to Register
                </button>

            </form>

        </div>
    );
}