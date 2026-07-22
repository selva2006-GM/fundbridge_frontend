import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import CampaignCard from "./CampaignCard";
import API_URL from "../config/api";
import homeData from "./data.json";

import "./Home.css";


export default function Home() {

    const navigate = useNavigate();

    const [campaigns, setCampaigns] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    

    useEffect(() => {

        async function fetchCampaigns() {
    
            try {
                setLoading(true);
                setError("");
    
                const response = await fetch(
                    `${API_URL}/api/campaigns?page=1&limit=5&sort=urgent`
                );
    
                if (!response.ok) {
                    throw new Error(
                        "Failed to fetch campaigns"
                    );
                }
    
                const data = await response.json();
    
                setCampaigns(
                    data.campaigns || []
                );
    
            } catch (error) {
    
                console.error(
                    "Campaign fetch error:",
                    error
                );
    
                setError(
                    homeData.campaignSection.errorMessage
                );
    
            } finally {
    
                setLoading(false);
    
            }
        }
    
        fetchCampaigns();
    
    }, []);


    function exploreCampaigns() {

        document
            .getElementById("campaigns")
            ?.scrollIntoView({
                behavior: "smooth"
            });

    }


    function StartCampaign() {
        const token = localStorage.getItem("token");
    
        if (!token) {
            navigate("/register", {
                state: {
                    returnTo: "/start-campaign"
                }
            });
            return;
        }
    
        navigate("/start-campaign");
    }


    return (

        <div className="home">


            {/* HERO */}

            <section className="hero">

                <div className="hero-content">

                    <h1>
                        {homeData.hero.title}
                    </h1>

                    <p>
                        {homeData.hero.description}
                    </p>


                    <div className="hero-buttons">

                        <button
                            onClick={exploreCampaigns}
                        >
                            {homeData.hero.exploreButton}
                        </button>


                        <button
                            onClick={StartCampaign}
                        >
                            {homeData.hero.startButton}
                        </button>

                    </div>

                </div>

            </section>



            {/* HOW IT WORKS */}

            <section className="how-it-works">

                <h2>
                    {homeData.howItWorks.title}
                </h2>

                <p>
                    {homeData.howItWorks.description}
                </p>


                <div className="steps">

                    {homeData.howItWorks.steps.map(
                        (step) => (

                            <div
                                className="step"
                                key={step.id}
                            >

                                <span>
                                    {step.id}
                                </span>

                                <h3>
                                    {step.title}
                                </h3>

                                <p>
                                    {step.description}
                                </p>

                            </div>

                        )
                    )}

                </div>

            </section>



            {/* CAMPAIGNS */}

            <section
                className="campaign-section"
                id="campaigns"
            >

                <div className="campaign-heading">

                    <h2>
                        {
                            homeData
                                .campaignSection
                                .title
                        }
                    </h2>

                    <p>
                        {
                            homeData
                                .campaignSection
                                .description
                        }
                    </p>

                </div>


                {loading && (

                    <p className="campaign-status">

                        {
                            homeData
                                .campaignSection
                                .loadingMessage
                        }

                    </p>

                )}


                {error && (

                    <p className="campaign-error">

                        {error}

                    </p>

                )}


                {!loading &&
                    !error &&
                    campaigns.length === 0 && (

                        <p className="campaign-status">

                            {
                                homeData
                                    .campaignSection
                                    .emptyMessage
                            }

                        </p>

                    )
                }


                <div className="campaign-grid">

                    {campaigns.map(
                        (campaign) => (

                            <CampaignCard
                                key={campaign.id}
                                campaign={campaign}
                            />

                        )
                    )}

                </div>

            <div className="explore-all">
                <button
                    onClick={() => navigate("/campaigns")}
                >
                    Explore All Campaigns
                </button>
            </div>

            </section>



            {/* BOTTOM CTA */}

            <section className="home-cta">

                <h2>
                    {homeData.cta.title}
                </h2>

                <p>
                    {homeData.cta.description}
                </p>

                <button
                    onClick={StartCampaign}
                >
                    {homeData.cta.button}
                </button>

            </section>


        </div>

    );
}