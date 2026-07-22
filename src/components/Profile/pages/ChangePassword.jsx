import { useEffect, useState } from "react";
import API_URL from "../../../config/api";

import "./ChangePassword.css";

export default function ChangePassword({
    setActivePage
}) {
    const [step, setStep] = useState("verify");

    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] =
        useState("");
    const [confirmPassword, setConfirmPassword] =
        useState("");

    const [message, setMessage] = useState("");
    const [sending, setSending] = useState(true);
    const [loading, setLoading] = useState(false);

    const token = localStorage.getItem("token");


    useEffect(() => {
        async function sendOTP() {
            if (!token) {
                setMessage("Please log in to continue.");
                setSending(false);
                return;
            }

            try {
                setSending(true);
                setMessage("");

                const response = await fetch(
                    `${API_URL}/api/password/send-otp`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    setMessage(
                        data.message ||
                        "Unable to send verification code."
                    );
                    return;
                }

                setMessage(
                    "Verification code sent to your email."
                );

            } catch (error) {
                console.error(
                    "Password OTP error:",
                    error
                );

                setMessage(
                    "Unable to connect to the server."
                );

            } finally {
                setSending(false);
            }
        }

        sendOTP();

    }, [token]);


    async function handleVerifyOTP(e) {
        e.preventDefault();

        if (otp.length !== 6) {
            setMessage(
                "Please enter the 6-digit OTP."
            );
            return;
        }

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/password/verify-otp`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        otp
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "OTP verification failed."
                );
                return;
            }

            sessionStorage.setItem(
                "passwordChangeToken",
                data.passwordChangeToken
            );

            setStep("password");
            setMessage("");

        } catch (error) {
            console.error(
                "OTP verification error:",
                error
            );

            setMessage(
                "Unable to verify OTP."
            );

        } finally {
            setLoading(false);
        }
    }


    async function handleChangePassword(e) {
        e.preventDefault();

        if (newPassword.length < 8) {
            setMessage(
                "Password must contain at least 8 characters."
            );
            return;
        }

        if (newPassword !== confirmPassword) {
            setMessage(
                "Passwords do not match."
            );
            return;
        }

        const passwordChangeToken =
            sessionStorage.getItem(
                "passwordChangeToken"
            );

        try {
            setLoading(true);
            setMessage("");

            const response = await fetch(
                `${API_URL}/api/password/change`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type":
                            "application/json",

                        Authorization:
                            `Bearer ${token}`,

                        "X-Password-Change-Token":
                            passwordChangeToken
                    },

                    body: JSON.stringify({
                        newPassword
                    })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setMessage(
                    data.message ||
                    "Unable to change password."
                );
                return;
            }

            sessionStorage.removeItem(
                "passwordChangeToken"
            );

            setMessage(
                "Password changed successfully."
            );

            setTimeout(() => {
                setActivePage("settings");
            }, 1500);

        } catch (error) {
            console.error(
                "Change password error:",
                error
            );

            setMessage(
                "Unable to change password."
            );

        } finally {
            setLoading(false);
        }
    }


    return (
        <div className="change-password-page">

            <div className="change-password-card">

                <button
                    type="button"
                    className="change-password-back"
                    onClick={() =>
                        setActivePage("settings")
                    }
                >
                    ← Back
                </button>


                <div className="change-password-icon">
                    🔒
                </div>


                <h2>
                    Change Password
                </h2>


                {step === "verify" && (
                    <>
                        <p>
                            Verify your identity before
                            changing your password.
                        </p>

                        {sending ? (
                            <p>
                                Sending verification code...
                            </p>
                        ) : (
                            <form
                                onSubmit={
                                    handleVerifyOTP
                                }
                            >
                                <label>
                                    Verification Code
                                </label>

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
                                        : "Verify OTP"
                                    }
                                </button>
                            </form>
                        )}
                    </>
                )}


                {step === "password" && (
                    <form
                        onSubmit={
                            handleChangePassword
                        }
                    >
                        <label>
                            New Password
                        </label>

                        <input
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) =>
                                setNewPassword(
                                    e.target.value
                                )
                            }
                        />


                        <label>
                            Confirm Password
                        </label>

                        <input
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(
                                    e.target.value
                                )
                            }
                        />


                        <button
                            type="submit"
                            disabled={loading}
                        >
                            {loading
                                ? "Changing Password..."
                                : "Change Password"
                            }
                        </button>
                    </form>
                )}


                {message && (
                    <p className="change-password-message">
                        {message}
                    </p>
                )}

            </div>

        </div>
    );
}