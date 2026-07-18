import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";

export default function StartCampaign() {
    const navigate = useNavigate();

    useEffect(() => {
        async function checkSetup() {
            const token = localStorage.getItem("token");

            if (!token) {
                navigate("/login");
                return;
            }

            try {
                const response = await fetch(
                    `${API_URL}/api/verification/status`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                const data = await response.json();

                if (!response.ok) {
                    console.error(data);
                    return;
                }

                if (data.status === "verified") {
                    navigate("/create-campaign");
                } else {
                    navigate("/campaign-setup");
                }

            } catch (error) {
                console.error(error);
            }
        }

        checkSetup();
    }, [navigate]);

    return (
        <div>
            <p>Checking your creator setup...</p>
        </div>
    );
}