import { useEffect, useState } from "react";
import API_URL from "../../../config/api";

import "./PayoutDetails.css";

export default function PayoutDetails({
    setActivePage
}) {
    const [form, setForm] = useState({
        payout_method: "bank",

        account_holder_name: "",
        bank_name: "",
        account_number: "",
        ifsc_code: "",

        upi_id: ""
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");


    useEffect(() => {

        async function fetchPayout() {

            const token =
                localStorage.getItem("token");

            try {

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


                if (
                    response.ok &&
                    data.payout
                ) {

                    setForm({
                        payout_method:
                            data.payout
                                .payout_method ||
                            "bank",

                        account_holder_name:
                            data.payout
                                .account_holder_name ||
                            "",

                        bank_name:
                            data.payout
                                .bank_name ||
                            "",

                        account_number:
                            data.payout
                                .account_number ||
                            "",

                        ifsc_code:
                            data.payout
                                .ifsc_code ||
                            "",

                        upi_id:
                            data.payout
                                .upi_id ||
                            ""
                    });

                }

            } catch (error) {

                console.error(
                    "Payout fetch error:",
                    error
                );

            } finally {

                setLoading(false);

            }
        }


        fetchPayout();

    }, []);


    function handleChange(e) {

        setForm({
            ...form,

            [e.target.name]:
                e.target.value
        });

    }


    async function handleSave(e) {

        e.preventDefault();

        const token =
            localStorage.getItem("token");


        try {

            setSaving(true);

            setMessage("");


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

                    body:
                        JSON.stringify(form)
                }
            );


            const data =
                await response.json();


            if (!response.ok) {

                setMessage(
                    data.message ||
                    "Unable to save payout details"
                );

                return;
            }


            setMessage(
                "Payout details saved successfully"
            );


        } catch (error) {

            console.error(error);

            setMessage(
                "Unable to save payout details"
            );

        } finally {

            setSaving(false);

        }
    }


    if (loading) {

        return (
            <p>
                Loading payout details...
            </p>
        );

    }


    return (

        <div className="payout-page">

            <div className="profile-header">

                <div>

                    <h2>
                        Payout Details
                    </h2>

                    <p>
                        Choose where your campaign
                        funds should be received.
                    </p>

                </div>


                <button
                    onClick={() =>
                        setActivePage(
                            "settings"
                        )
                    }
                >
                    Back
                </button>

            </div>


            <form
                className="payout-form"
                onSubmit={handleSave}
            >


                <div className="form-section">

                    <h3>
                        Payout Method
                    </h3>


                    <select
                        name="payout_method"
                        value={
                            form.payout_method
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="bank">
                            Bank Account
                        </option>

                        <option value="upi">
                            UPI
                        </option>

                    </select>

                </div>


                {form.payout_method ===
                    "bank" && (

                    <div className="form-section">

                        <h3>
                            Bank Account
                        </h3>


                        <label>

                            Account Holder Name

                            <input
                                name=
                                    "account_holder_name"
                                value={
                                    form
                                        .account_holder_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </label>


                        <label>

                            Bank Name

                            <input
                                name="bank_name"
                                value={
                                    form.bank_name
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </label>


                        <label>

                            Account Number

                            <input
                                name=
                                    "account_number"
                                value={
                                    form
                                        .account_number
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </label>


                        <label>

                            IFSC Code

                            <input
                                name="ifsc_code"
                                value={
                                    form.ifsc_code
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </label>

                    </div>

                )}


                {form.payout_method ===
                    "upi" && (

                    <div className="form-section">

                        <h3>
                            UPI Details
                        </h3>


                        <label>

                            UPI ID

                            <input
                                name="upi_id"
                                placeholder=
                                    "name@bank"
                                value={
                                    form.upi_id
                                }
                                onChange={
                                    handleChange
                                }
                                required
                            />

                        </label>

                    </div>

                )}


                {message && (

                    <p className="payout-message">
                        {message}
                    </p>

                )}


                <div className="payout-actions">

                    <button
                        type="button"
                        onClick={() =>
                            setActivePage(
                                "settings"
                            )
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : "Save Payout Details"
                        }
                    </button>

                </div>

            </form>

        </div>
    );
}