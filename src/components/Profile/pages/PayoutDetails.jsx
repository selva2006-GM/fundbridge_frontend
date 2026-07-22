import { useEffect, useState } from "react";
import API_URL from "../../../config/api";

import "./PayoutDetails.css";

export default function PayoutDetails({
    setActivePage
}) {

    const [payout, setPayout] =
        useState(null);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    useEffect(() => {

        async function fetchPayout() {

            const token =
                localStorage.getItem("token");

            if (!token) {
                setError(
                    "Please log in to view payout details."
                );

                setLoading(false);

                return;
            }


            try {

                setError("");


                const response = await fetch(
                    `${API_URL}/api/payout`,
                    {
                        headers: {
                            Authorization:
                                `Bearer ${token}`
                        }
                    }
                );


                const data =
                    await response.json();


                if (!response.ok) {

                    setError(
                        data.message ||
                        "Unable to load payout details."
                    );

                    return;
                }


                setPayout(
                    data.payout || null
                );


            } catch (error) {

                console.error(
                    "Payout fetch error:",
                    error
                );


                setError(
                    "Unable to connect to the server."
                );


            } finally {

                setLoading(false);

            }

        }


        fetchPayout();

    }, []);



    /*
        Hide most of the Razorpay
        account ID from the UI
    */

    function maskAccountId(accountId) {

        if (!accountId) {
            return "Not available";
        }


        if (accountId.length <= 8) {
            return accountId;
        }


        return (
            accountId.slice(0, 4) +
            "••••••" +
            accountId.slice(-4)
        );

    }



    if (loading) {

        return (

            <div className="payout-loading">

                Loading payout account...

            </div>

        );

    }



    return (

        <div className="payout-page">


            {/* HEADER */}

            <div className="profile-header">


                <div>

                    <h2>
                        Payout Account
                    </h2>

                    <p>
                        Manage the account used to
                        receive funds from your campaigns.
                    </p>

                </div>


                <button
                    type="button"

                    onClick={() =>
                        setActivePage(
                            "settings"
                        )
                    }
                >

                    Back

                </button>


            </div>



            {/* ERROR */}

            {error && (

                <p className="payout-message">

                    {error}

                </p>

            )}



            {/* NOT CONNECTED */}

            {!error && !payout && (

                <div className="payout-empty">


                    <div className="payout-empty-icon">

                        ₹

                    </div>


                    <h3>

                        No payout account connected

                    </h3>


                    <p>

                        Connect your payout account
                        before starting a campaign
                        and receiving funds.

                    </p>


                    <button
                        type="button"

                        onClick={() =>
                            setActivePage(
                                "edit-payout"
                            )
                        }
                    >

                        Connect Payout Account

                    </button>


                </div>

            )}



            {/* CONNECTED ACCOUNT */}

            {!error && payout && (

                <div className="payout-form">


                    <div className="form-section">


                        <div className="payout-account-header">


                            <div className="payout-provider-icon">

                                ₹

                            </div>


                            <div>

                                <h3>
                                    Payout Account
                                </h3>

                                <p>
                                    Connected through
                                    the payment provider
                                </p>

                            </div>


                        </div>



                        <div className="payout-detail-row">


                            <span>
                                Account Status
                            </span>


                            <strong
                                className={
                                    payout
                                        .razorpay_account_status ===
                                    "connected"

                                        ? "payout-status connected"

                                        : "payout-status pending"
                                }
                            >

                                {
                                    payout
                                        .razorpay_account_status ===
                                    "connected"

                                        ? "Connected"

                                        : payout
                                            .razorpay_account_status ||
                                          "Pending"
                                }

                            </strong>


                        </div>



                        <div className="payout-detail-row">


                            <span>
                                Account ID
                            </span>


                            <strong>

                                {
                                    maskAccountId(
                                        payout
                                            .razorpay_account_id
                                    )
                                }

                            </strong>


                        </div>


                    </div>



                    {/* SECURITY */}

                    <div className="payout-security-notice">


                        <span className="security-icon">

                            🔒

                        </span>


                        <div>


                            <strong>

                                Your payout account is protected

                            </strong>


                            <p>

                                Payout information and
                                verification are handled
                                securely through the
                                payment provider.

                            </p>


                        </div>


                    </div>



                    {/* ACTIONS */}

                    <div className="payout-actions">


                        <button
                            type="button"

                            onClick={() =>
                                setActivePage(
                                    "settings"
                                )
                            }
                        >

                            Back

                        </button>


                        {payout
                            .razorpay_account_status !==
                            "connected" && (

                            <button
                                type="button"

                                onClick={() =>
                                    setActivePage(
                                        "edit-payout"
                                    )
                                }
                            >

                                Continue Setup

                            </button>

                        )}


                    </div>


                </div>

            )}


        </div>

    );

}