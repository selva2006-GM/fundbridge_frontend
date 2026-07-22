import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../../../config/api";
import "./DeleteAccount.css";

export default function DeleteAccount({
    setActivePage
}) {

    const navigate = useNavigate();

    const [step, setStep] =
        useState("verify");

    const [otp, setOtp] =
        useState("");

    const [confirmText, setConfirmText] =
        useState("");

    const [message, setMessage] =
        useState("");

    const [sending, setSending] =
        useState(true);

    const [loading, setLoading] =
        useState(false);


    const token =
        localStorage.getItem("token");


    /*
        Send OTP automatically
        when page opens
    */

    useEffect(() => {

        async function sendOTP() {

            if (!token) {

                setMessage(
                    "Please log in to continue."
                );

                setSending(false);

                return;
            }


            try {

                setSending(true);
                setMessage("");


                const response = await fetch(
                    `${API_URL}/api/account/delete/send-otp`,
                    {
                        method: "POST",

                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    setMessage(
                        data.message ||
                        "Unable to send verification code."
                    );

                    return;
                }


                setMessage(
                    data.message ||
                    "Verification code sent to your email."
                );


            } catch (error) {

                console.error(
                    "Delete account OTP error:",
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


    /*
        Verify OTP
    */

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
                `${API_URL}/api/account/delete/verify-otp`,
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


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "OTP verification failed."
                );

                return;
            }


            /*
                Store temporary deletion token
            */

            sessionStorage.setItem(
                "accountDeleteToken",
                data.accountDeleteToken
            );


            /*
                Move to final confirmation
            */

            setStep("confirm");

            setMessage("");


        } catch (error) {

            console.error(
                "Delete OTP verification error:",
                error
            );


            setMessage(
                "Unable to verify OTP."
            );


        } finally {

            setLoading(false);

        }

    }



    /*
        Delete Account
    */

    async function handleDeleteAccount() {

        if (confirmText !== "DELETE") {

            setMessage(
                'Please type "DELETE" to confirm.'
            );

            return;
        }


        const accountDeleteToken =
            sessionStorage.getItem(
                "accountDeleteToken"
            );


        if (!accountDeleteToken) {

            setMessage(
                "Verification expired. Please verify again."
            );

            return;
        }


        try {

            setLoading(true);
            setMessage("");


            const response = await fetch(
                `${API_URL}/api/account/delete`,
                {
                    method: "DELETE",

                    headers: {

                        Authorization:
                            `Bearer ${token}`,

                        "X-Account-Delete-Token":
                            accountDeleteToken

                    }

                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Unable to delete account."
                );

                return;
            }


            /*
                Remove authentication data
            */

            localStorage.removeItem("token");

            sessionStorage.removeItem(
                "accountDeleteToken"
            );


            /*
                Redirect user
            */

            navigate("/", {
                replace: true
            });


        } catch (error) {

            console.error(
                "Delete account error:",
                error
            );


            setMessage(
                "Unable to delete account."
            );


        } finally {

            setLoading(false);

        }

    }



    return (

        <div className="delete-account-page">

            <div className="delete-account-card">


                <button
                    type="button"
                    className="delete-account-back"
                    onClick={() =>
                        setActivePage("settings")
                    }
                >
                    ← Back
                </button>



                <div className="delete-account-icon">
                    ⚠️
                </div>



                <h2>
                    Delete Account
                </h2>



                {/* OTP VERIFICATION */}

                {step === "verify" && (

                    <>

                        <p className="delete-account-description">

                            To protect your account,
                            verify your identity before
                            permanently deleting your
                            account.

                        </p>


                        {sending ? (

                            <p>
                                Sending verification code...
                            </p>

                        ) : (

                            <form
                                className="delete-account-form"
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

                                    {
                                        loading
                                            ? "Verifying..."
                                            : "Verify Identity"
                                    }

                                </button>

                            </form>

                        )}

                    </>

                )}



                {/* FINAL CONFIRMATION */}

                {step === "confirm" && (

                    <div className="delete-confirmation">


                        <div className="delete-warning">

                            <strong>
                                This action is permanent
                            </strong>

                            <p>
                                Your account and associated
                                data will be permanently
                                deleted. This action cannot
                                be undone.
                            </p>

                        </div>


                        <label>
                            Type DELETE to confirm
                        </label>


                        <input
                            type="text"
                            placeholder="DELETE"
                            value={confirmText}

                            onChange={(e) =>
                                setConfirmText(
                                    e.target.value
                                )
                            }
                        />


                        <button
                            type="button"
                            className="delete-confirm-button"

                            disabled={
                                loading ||
                                confirmText !== "DELETE"
                            }

                            onClick={
                                handleDeleteAccount
                            }
                        >

                            {
                                loading
                                    ? "Deleting Account..."
                                    : "Permanently Delete Account"
                            }

                        </button>


                        <button
                            type="button"
                            className="delete-cancel-button"

                            onClick={() =>
                                setActivePage(
                                    "settings"
                                )
                            }
                        >

                            Cancel

                        </button>

                    </div>

                )}



                {message && (

                    <p className="delete-account-message">
                        {message}
                    </p>

                )}


            </div>

        </div>

    );

}