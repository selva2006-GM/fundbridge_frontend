import { useState } from "react";
import { useNavigate } from "react-router-dom";

import API_URL from "../config/api";
import "./CreateCampaign.css";
import uploadImage from "../utils/uploadImage";

export default function CreateCampaign({
    onCancel,
    onSuccess
}){
    const navigate = useNavigate();

    const [form, setForm] = useState({
        title: "",
        description: "",
        category: "",
        goal_amount: "",
        beneficiary_name: "",
        beneficiary_age: "",
        image_url: "",
        end_date: null
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState("");
    const [uploadingImage, setUploadingImage] =
        useState(false);

    function handleChange(e) {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    }
    function handleImageChange(e) {
        const file = e.target.files[0];
    
        if (!file) return;
    
        if (file.size > 5 * 1024 * 1024) {
            setMessage(
                "Image must be smaller than 5 MB"
            );
            return;
        }
    
        setImageFile(file);
    
        setImagePreview(
            URL.createObjectURL(file)
        );
    
        setMessage("");
    }


    async function handleSubmit(e) {
        e.preventDefault();
    
        const token = localStorage.getItem("token");
    
        if (!token) {
            navigate("/login");
            return;
        }
    
        try {
            setLoading(true);
            setMessage("");
    
            let imageUrl = "";
    
            // Upload image first
            if (imageFile) {
                setUploadingImage(true);
    
                imageUrl = await uploadImage(
                    imageFile
                );
    
                setUploadingImage(false);
            }
    
            // Then create campaign
            const response = await fetch(
                `${API_URL}/api/campaigns`,
                {
                    method: "POST",
    
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
    
                    body: JSON.stringify({
                        ...form,
                        image_url: imageUrl
                    })
                }
            );
    
            const data = await response.json();
    
            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to create campaign"
                );
            }
    
            if (onSuccess) {
                onSuccess(data.campaign);
            } else {
                navigate("/profile");
            }
    
        } catch (error) {
            console.error(
                "CREATE CAMPAIGN ERROR:",
                error
            );
    
            setMessage(
                error.message ||
                "Unable to create campaign"
            );
    
        } finally {
            setLoading(false);
            setUploadingImage(false);
        }
    }


    return (
        <div className="create-campaign-page">

            <form
                className="create-campaign-form"
                onSubmit={handleSubmit}
            >

                <div className="create-campaign-header">

                    <div>
                        <h1>Create a Campaign</h1>

                        <p>
                            Tell your story and explain
                            why you need support.
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                </div>


                <div className="form-section">

                    <h2>Campaign Information</h2>


                    <label>
                        Campaign Title

                        <input
                            name="title"
                            placeholder="Give your campaign a title"
                            value={form.title ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </label>


                    <label>
                        Campaign Story

                        <textarea
                            name="description"
                            placeholder="Explain your situation and how the funds will be used..."
                            value={form.description ?? ""}
                            onChange={handleChange}
                            required
                        />
                    </label>


                    <div className="form-row">

                        <label>
                            Category

                            <select
                                name="category"
                                value={form.category ?? ""}
                                onChange={handleChange}
                                required
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
                                placeholder="₹ Amount"
                                value={form.goal_amount ?? ""}
                                onChange={handleChange}
                                required
                                min="1"
                            />
                        </label>

                    </div>

                </div>


                <div className="form-section">

                    <h2>Beneficiary Details</h2>

                    <div className="form-row">

                        <label>
                            Beneficiary Name

                            <input
                                name="beneficiary_name"
                                placeholder="Full name"
                                value={
                                    form.beneficiary_name?? ""
                                }
                                onChange={handleChange}
                            />
                        </label>


                        <label>
                            Beneficiary Age

                            <input
                                type="number"
                                name="beneficiary_age"
                                placeholder="Age"
                                value={
                                    form.beneficiary_age ?? ""
                                }
                                onChange={handleChange}
                                min="0"
                            />
                        </label>

                    </div>

                </div>


                <div className="campaign-image-upload">

                <label>
                    Campaign Image
                </label>

                <label className="image-upload-box">

                {imagePreview ? (
                        <img
                            src={imagePreview}
                            alt="Campaign preview"
                            className="image-preview"
                        />
                    ) : (
                        <div className="upload-placeholder">

                            <span>+</span>

                            <strong>
                                Choose Campaign Image
                            </strong>

                            <p>
                                JPG, PNG or WebP — Max 5 MB
                            </p>

                        </div>
                    )}

                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleImageChange}
                        hidden
                    />

                </label>

                {imagePreview && (
                    <button
                        type="button"
                        className="change-image-button"
                        onClick={() => {
                            setImageFile(null);
                            setImagePreview("");
                        }}
                    >
                        Remove Image
                    </button>
                )}

            </div>
            <label> Campaign End Date <input type="date" name="end_date" value={form.end_date ?? ""} onChange={handleChange} required /> </label>

                {message && (
                    <p className="create-campaign-message">
                        {message}
                    </p>
                )}


                <div className="create-campaign-actions">

                    <button
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Creating..."
                            : "Create Campaign"}
                    </button>

                </div>

            </form>

        </div>
    );
}