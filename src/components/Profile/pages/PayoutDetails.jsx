import { useEffect, useState } from "react";
import API_URL from "../../../config/api";

import "./PayoutDetails.css";

export default function PayoutDetails({
    setActivePage
}) {

    const [payout, setPayout] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    useEffect(() => {

        async function fetchPayout() {

            const token =
                localStorage.getItem("token");

            try {

                setLoading(true);
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
                        "Unable to load payout details"
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
                    "Unable to load payout details"
                );

            } finally {

                setLoading(false);

            }
        }


        fetchPayout();

    }, []);


    if (loading) {

        return (
            <p className="payout-loading">
                Loading payout details...
            </p>
        );

    }


    return (

        <div className="payout-page">


            {/* HEADER */}

            <div className="profile-header">

                <div>

                    <h2>
                        Payout Details
                    </h2>

                    <p>
                        Manage where your campaign
                        funds are received.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        setActivePage("settings")
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


            {/* NO PAYOUT DETAILS */}

            {!error && !payout && (

                <div className="payout-empty">

                    <div className="payout-empty-icon">
                        $
                    </div>

                    <h3>
                        No payout method added
                    </h3>

                    <p>
                        Add a payout method before
                        starting a campaign.
                    </p>

                    <button
                        type="button"
                        onClick={() =>
                            setActivePage(
                                "edit-payout"
                            )
                        }
                    >
                        Add Payout Details
                    </button>

                </div>

            )}


            {/* PAYOUT DETAILS */}

            {!error && payout && (

                <div className="payout-form">


                    {/* METHOD */}

                    <div className="form-section">

                        <h3>
                            Payout Method
                        </h3>

                        <div className="payout-detail-row">

                            <span>
                                Method
                            </span>

                            <strong>
                                {
                                    payout.payout_method ===
                                    "bank"
                                        ? "Bank Account"
                                        : "UPI"
                                }
                            </strong>

                        </div>

                    </div>



                    {/* BANK DETAILS */}

                    {payout.payout_method ===
                        "bank" && (

                        <div className="form-section">

                            <h3>
                                Bank Account
                            </h3>


                            <div className="payout-detail-row">

                                <span>
                                    Account Holder
                                </span>

                                <strong>
                                    {
                                        payout
                                            .account_holder_name ||
                                        "Not available"
                                    }
                                </strong>

                            </div>


                            <div className="payout-detail-row">

                                <span>
                                    Bank Name
                                </span>

                                <strong>
                                    {
                                        payout.bank_name ||
                                        "Not available"
                                    }
                                </strong>

                            </div>


                            <div className="payout-detail-row">

                                <span>
                                    Account Number
                                </span>

                                <strong>
                                    {
                                        payout
                                            .account_number ||
                                        "Not available"
                                    }
                                </strong>

                            </div>


                            <div className="payout-detail-row">

                                <span>
                                    IFSC Code
                                </span>

                                <strong>
                                    {
                                        payout.ifsc_code ||
                                        "Not available"
                                    }
                                </strong>

                            </div>

                        </div>

                    )}



                    {/* UPI DETAILS */}

                    {payout.payout_method ===
                        "upi" && (

                        <div className="form-section">

                            <h3>
                                UPI Details
                            </h3>

                            <div className="payout-detail-row">

                                <span>
                                    UPI ID
                                </span>

                                <strong>
                                    {
                                        payout.upi_id ||
                                        "Not available"
                                    }
                                </strong>

                            </div>

                        </div>

                    )}



                    {/* SECURITY NOTICE */}

                    <div className="payout-security-notice">

                        <span className="security-icon">
                            🔒
                        </span>

                        <div>

                            <strong>
                                Payout details are protected
                            </strong>

                            <p>
                                For your security, you must
                                verify your identity before
                                changing payout information.
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


                        <button
                            type="button"
                            onClick={() =>
                                setActivePage(
                                    "verify-payout"
                                )
                            }
                        >
                            Verify to Edit
                        </button>

                    </div>


                </div>

            )}

        </div>

    );
}