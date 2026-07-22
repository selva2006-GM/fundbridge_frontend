import { useEffect, useState } from "react";
import API_URL from "../../../config/api";

import "./EditCampaign.css";

export default function EditCampaign({
    campaignId,
    setActivePage,
    setCampaigns
}) {

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        goal_amount: "",
        image_url: "",
        beneficiary_name: "",
        end_date: ""
    });

    const [loading, setLoading] =
        useState(true);

    const [saving, setSaving] =
        useState(false);

    const [message, setMessage] =
        useState("");


    // Fetch existing campaign
    useEffect(() => {

        async function fetchCampaign() {

            try {

                setLoading(true);

                const response = await fetch(
                    `${API_URL}/api/campaigns/${campaignId}`
                );

                const data =
                    await response.json();


                if (!response.ok) {
                    throw new Error(
                        data.message ||
                        "Unable to load campaign"
                    );
                }


                const campaign = data.campaign;


                setForm({
                    title:
                        campaign.title || "",

                    description:
                        campaign.description || "",

                    category:
                        campaign.category || "",

                    goal_amount:
                        campaign.goal_amount || "",

                    image_url:
                        campaign.image_url || "",

                    beneficiary_name:
                        campaign.beneficiary_name || "",

                    end_date:
                        campaign.end_date
                            ? campaign.end_date
                                .split("T")[0]
                            : ""
                });


            } catch (error) {

                console.error(
                    "FETCH CAMPAIGN ERROR:",
                    error
                );

                setMessage(error.message);

            } finally {

                setLoading(false);

            }
        }


        if (campaignId) {
            fetchCampaign();
        }

    }, [campaignId]);

    async function handleImageChange(e) {
        const file = e.target.files[0];
    
        if (!file) return;
    
        try {
            setUploadingImage(true);
            setMessage("");
    
            const imageData = new FormData();
    
            imageData.append("file", file);
            imageData.append(
                "upload_preset",
                "YOUR_UPLOAD_PRESET"
            );
    
            const response = await fetch(
                "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
                {
                    method: "POST",
                    body: imageData
                }
            );
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(
                    data.error?.message ||
                    "Image upload failed"
                );
            }
    
            setForm((currentForm) => ({
                ...currentForm,
                image_url: data.secure_url
            }));
    
        } catch (error) {
            console.error(
                "IMAGE UPLOAD ERROR:",
                error
            );
    
            setMessage(error.message);
    
        } finally {
            setUploadingImage(false);
        }
    }
    
    function handleChange(e) {

        const {
            name,
            value
        } = e.target;


        setForm((currentForm) => ({
            ...currentForm,

            [name]: value
        }));

    }


    async function handleSubmit(e) {

        e.preventDefault();


        const token =
            localStorage.getItem("token");


        try {

            setSaving(true);
            setMessage("");


            const response = await fetch(
                `${API_URL}/api/campaigns/${campaignId}`,
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

                throw new Error(
                    data.message ||
                    "Unable to update campaign"
                );

            }


            // Update campaign immediately
            // inside Profile state
            setCampaigns(
                (currentCampaigns) =>

                    currentCampaigns.map(
                        (campaign) =>

                            campaign.id ===
                                data.campaign.id

                                ? {
                                    ...campaign,
                                    ...data.campaign
                                }

                                : campaign
                    )
            );


            // Return to My Campaigns
            setActivePage(
                "my-campaigns"
            );


        } catch (error) {

            console.error(
                "UPDATE CAMPAIGN ERROR:",
                error
            );

            setMessage(
                error.message
            );


        } finally {

            setSaving(false);

        }

    }


    if (loading) {

        return (

            <div className="edit-campaign-loading">

                Loading campaign...

            </div>

        );

    }


    return (

        <div className="profile-page-content">


            <div className="profile-header">

                <div>

                    <h2>
                        Edit Campaign
                    </h2>

                    <p>
                        Update your campaign information.
                    </p>

                </div>


                <button
                    type="button"
                    onClick={() =>
                        setActivePage(
                            "my-campaigns"
                        )
                    }
                >
                    Back
                </button>

            </div>


            <form
                className="edit-campaign-form"
                onSubmit={handleSubmit}
            >


                <label>

                    Campaign Title

                    <input
                        type="text"
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required
                    />

                </label>


                <label>

                    Description

                    <textarea
                        name="description"
                        value={
                            form.description
                        }
                        onChange={
                            handleChange
                        }
                        rows="6"
                        required
                    />

                </label>


                <label>

                    Category

                    <select
                        name="category"
                        value={
                            form.category
                        }
                        onChange={
                            handleChange
                        }
                    >

                        <option value="">
                            Select Category
                        </option>

                        <option value="Medical">
                            Medical
                        </option>

                        <option value="Education">
                            Education
                        </option>

                        <option value="Emergency">
                            Emergency
                        </option>

                        <option value="Community">
                            Community
                        </option>

                        <option value="Other">
                            Other
                        </option>

                    </select>

                </label>


                <label>

                    Goal Amount

                    <input
                        type="number"
                        name="goal_amount"
                        value={
                            form.goal_amount
                        }
                        onChange={
                            handleChange
                        }
                        min="1"
                        required
                    />

                </label>


                <label>

                    Beneficiary Name

                    <input
                        type="text"
                        name="beneficiary_name"
                        value={
                            form.beneficiary_name
                        }
                        onChange={
                            handleChange
                        }
                    />

                </label>


                <label>

                    Campaign End Date

                    <input
                        type="date"
                        name="end_date"
                        value={
                            form.end_date
                        }
                        onChange={
                            handleChange
                        }
                        required
                    />

                </label>


                <label>

                    Image URL

                    <input
                        type="text"
                        name="image_url"
                        value={
                            form.image_url
                        }
                        onChange={
                            handleChange
                        }
                    />

                </label>


                {form.image_url && (

                    <div className="edit-image-preview">

                        <img
                            src={form.image_url}
                            alt="Campaign preview"
                        />

                    </div>

                )}


                {message && (

                    <p className="edit-campaign-message">

                        {message}

                    </p>

                )}


                <div className="edit-campaign-actions">

                    <button
                        type="button"
                        onClick={() =>
                            setActivePage(
                                "my-campaigns"
                            )
                        }
                    >
                        Cancel
                    </button>


                    <button
                        type="submit"
                        disabled={saving}
                    >

                        {
                            saving
                                ? "Saving..."
                                : "Save Changes"
                        }

                    </button>

                </div>


            </form>

        </div>

    );
}