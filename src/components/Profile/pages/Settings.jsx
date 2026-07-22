import { useState } from "react";
import API_URL from "../../../config/api";

import "./Settings.css";

export default function Settings({ user, setUser , setActivePage}) {
    const [editing, setEditing] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState("");

    const [form, setForm] = useState({
        full_name: user?.full_name || "",
        phone_number: user?.phone_number || ""
    });


    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }


    function handleEdit() {
        setForm({
            full_name: user?.full_name || "",
            phone_number: user?.phone_number || ""
        });

        setEditing(true);
        setMessage("");
    }


    function handleCancel() {
        setEditing(false);

        setForm({
            full_name: user?.full_name || "",
            phone_number: user?.phone_number || ""
        });
    }


    async function handleSave() {
        const token = localStorage.getItem("token");

        try {
            setSaving(true);
            setMessage("");

            const response = await fetch(
                `${API_URL}/profile`,
                {
                    method: "PUT",

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
                    data.message ||
                    "Failed to update profile"
                );
                return;
            }

            // Update Profile.jsx user state
            setUser(data.user);

            setEditing(false);

            setMessage(
                "Profile updated successfully"
            );

        } catch (error) {
            console.error(
                "Profile update error:",
                error
            );

            setMessage(
                "Unable to update profile"
            );

        } finally {
            setSaving(false);
        }
    }


    return (
        <div className="settings-page">

            <div className="settings-header">

                <h2>Settings</h2>

                <p>
                    Manage your account, verification
                    and payout information.
                </p>

            </div>


            {/* PERSONAL INFORMATION */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div>
                        <h3>Personal Information</h3>

                        <p>
                            Manage your personal details.
                        </p>
                    </div>


                    {!editing && (
                        <button onClick={handleEdit}>
                            Edit
                        </button>
                    )}

                </div>


                <div className="settings-info-grid">


                    {/* USERNAME */}

                    <div>
                        <span>Username</span>

                        <strong>
                            {user?.username ||
                                "Not provided"}
                        </strong>
                    </div>


                    {/* EMAIL */}

                    <div>
                        <span>Email</span>

                        <strong>
                            {user?.email ||
                                "Not provided"}
                        </strong>
                    </div>


                    {/* FULL NAME */}

                    <div>

                        <span>Full Name</span>

                        {editing ? (

                            <input
                                type="text"
                                name="full_name"
                                value={form.full_name}
                                onChange={handleChange}
                                placeholder="Enter full name"
                            />

                        ) : (

                            <strong>
                                {user?.full_name ||
                                    "Not provided"}
                            </strong>

                        )}

                    </div>


                    {/* PHONE */}

                    <div>

                        <span>Phone Number</span>

                        {editing ? (

                            <input
                                type="tel"
                                name="phone_number"
                                value={form.phone_number}
                                onChange={handleChange}
                                placeholder="Enter phone number"
                            />

                        ) : (

                            <strong>
                                {user?.phone_number ||
                                    "Not provided"}
                            </strong>

                        )}

                    </div>

                </div>


                {editing && (

                    <div className="settings-edit-actions">

                        <button
                            type="button"
                            onClick={handleCancel}
                            disabled={saving}
                        >
                            Cancel
                        </button>


                        <button
                            type="button"
                            onClick={handleSave}
                            disabled={saving}
                        >
                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }
                        </button>

                    </div>

                )}


                {message && (
                    <p className="settings-message">
                        {message}
                    </p>
                )}

            </section>



            {/* VERIFICATION */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div>

                        <h3>
                            Identity Verification
                        </h3>

                        <p>
                            Verification is required
                            before creating fundraising
                            campaigns.
                        </p>

                    </div>


                    <span
                        className={
                            user?.verification_status ===
                            "verified"
                                ? "status verified"
                                : "status pending"
                        }
                    >
                        {user?.verification_status ||
                            "Not Verified"}
                    </span>

                </div>

            </section>



            {/* PAYOUT */}

            <section className="settings-card">

                <div className="settings-card-header">

                    <div>

                        <h3>Payout Details</h3>

                        <p>
                            Manage where campaign funds
                            are received.
                        </p>

                    </div>

                    <button 
                        onClick={()=>{
                            setActivePage("payout")
                        }}>
                        Manage
                    </button>

                </div>

            </section>



            {/* SECURITY */}

            <section className="settings-card">

                <h3>Security</h3>

                <div className="settings-action">

                    <div>

                        <strong>Password</strong>

                        <p>
                            Change your account password.
                        </p>

                    </div>

                    <button 
                        type = "button"
                        onClick={()=>setActivePage("change-password")}>
                        Change Password
                    </button>

                </div>

            </section>



            {/* DELETE ACCOUNT */}

            <section className="settings-card danger-zone">

                <h3>Delete Account</h3>

                <p>
                    Permanently delete your FundBridge
                    account and associated personal data.
                </p>

                <button 
                type="button"
                 onClick={()=> setActivePage("delete-account")}>
                    Delete Account
                </button>

            </section>

        </div>
    );
}