import { useEffect, useState } from "react";
import API_URL from ".././../../config/api";

import "./VerifyPayout.css";

export default function VerifyPayout({
    setActivePage
}) {

    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(true);
    const [otpSent, setOtpSent] = useState(false);


    /*
        Send OTP automatically when
        the verification page opens
    */

    useEffect(() => {

        async function sendOTP() {

            const token =
                localStorage.getItem("token");


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
                    `${API_URL}/api/payout/send-otp`,
                    {
                        method: "POST",

                        headers: {

                            "Content-Type":
                                "application/json",

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


                setOtpSent(true);

                setMessage(
                    data.message ||
                    "Verification code sent to your email."
                );


            } catch (error) {

                console.error(
                    "Send payout OTP error:",
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

    }, []);



    /*
        Verify OTP
    */

    async function handleSubmit(e) {

        e.preventDefault();


        if (otp.length !== 6) {

            setMessage(
                "Please enter the 6-digit OTP."
            );

            return;

        }


        const token =
            localStorage.getItem("token");


        if (!token) {

            setMessage(
                "Please log in to continue."
            );

            return;

        }


        try {

            setLoading(true);

            setMessage("");


            const response = await fetch(
                `${API_URL}/api/payout/verify-otp`,
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
                OTP successfully verified.

                Save the payout edit token if
                your backend returns one.
            */

            if (data.payoutEditToken) {

                sessionStorage.setItem(
                    "payoutEditToken",
                    data.payoutEditToken
                );

            }


            /*
                Open Edit Payout page
            */

            setActivePage(
                "edit-payout"
            );


        } catch (error) {

            console.error(
                "Payout OTP verification error:",
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
        Resend OTP
    */

    async function handleResendOTP() {

        const token =
            localStorage.getItem("token");


        if (!token) {

            setMessage(
                "Please log in to continue."
            );

            return;

        }


        try {

            setSending(true);

            setMessage("");


            const response = await fetch(
                `${API_URL}/api/payout/send-otp`,
                {

                    method: "POST",

                    headers: {

                        "Content-Type":
                            "application/json",

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
                    "Unable to resend OTP."
                );

                return;

            }


            setOtp("");

            setOtpSent(true);

            setMessage(
                "A new verification code has been sent."
            );


        } catch (error) {

            console.error(
                "Resend OTP error:",
                error
            );


            setMessage(
                "Unable to resend verification code."
            );


        } finally {

            setSending(false);

        }

    }



    return (

        <div className="verify-payout-page">


            <div className="verify-payout-card">


                <button
                    type="button"
                    className="verify-payout-back"
                    onClick={() =>
                        setActivePage(
                            "payout"
                        )
                    }
                >
                    ← Back
                </button>



                <div className="verify-payout-icon">

                    🔒

                </div>



                <h2>

                    Verify Your Identity

                </h2>



                <p className="verify-payout-description">

                    For your security, verify your
                    identity before changing your
                    payout information.

                </p>



                {sending && (

                    <p className="verify-payout-message">

                        Sending verification code...

                    </p>

                )}



                {!sending && otpSent && (

                    <form
                        onSubmit={handleSubmit}
                        className="verify-payout-form"
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

                            autoComplete="one-time-code"

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
                                    : "Verify and Continue"
                            }

                        </button>



                    </form>

                )}



                {message && (

                    <p className="verify-payout-message">

                        {message}

                    </p>

                )}



                {!sending && (

                    <button

                        type="button"

                        className="verify-payout-resend"

                        onClick={
                            handleResendOTP
                        }

                        disabled={sending}

                    >

                        Resend verification code

                    </button>

                )}


            </div>


        </div>

    );

}