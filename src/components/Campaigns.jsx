import { useEffect, useRef, useState } from "react";
import API_URL from "../config/api";
import CampaignCard from "./CampaignCard";
import "./Campaigns.css";


export default function Campaigns() {
    const [campaigns, setCampaigns] = useState([]);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sortBy, setSortBy] = useState("urgent");

    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);

    const loaderRef = useRef(null);

    // Fetch campaigns whenever page or filters change
    useEffect(() => {
        async function fetchCampaigns() {
            try {
                setLoading(true);

                const params = new URLSearchParams({
                    page: page,
                    limit: 6,
                    search: search,
                    category: category,
                    sort: sortBy
                });

                const response = await fetch(
                    `${API_URL}/api/campaigns?${params}`
                );

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(
                        data.message || "Failed to load campaigns"
                    );
                }

                if (page === 1) {
                    setCampaigns(data.campaigns);
                } else {
                    setCampaigns((previous) => [
                        ...previous,
                        ...data.campaigns
                    ]);
                }

                setHasMore(data.hasMore);

            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        }

        fetchCampaigns();

    }, [page, search, category, sortBy]);


    // Reset pagination when filters change
    useEffect(() => {
        setCampaigns([]);
        setPage(1);
        setHasMore(true);
    }, [search, category, sortBy]);


    // Infinite scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                if (
                    entries[0].isIntersecting &&
                    hasMore &&
                    !loading
                ) {
                    setPage((previous) => previous + 1);
                }
            },
            {
                threshold: 0.5
            }
        );

        const loader = loaderRef.current;

        if (loader) {
            observer.observe(loader);
        }

        return () => {
            if (loader) {
                observer.unobserve(loader);
            }
        };

    }, [hasMore, loading]);


    return (
        <div className="campaigns-page">

            <h1>Explore Campaigns</h1>

            <p className="campaigns-description">
                Find and support causes that matter to you.
            </p>


            <div className="campaign-filters">

                <input
                    type="text"
                    placeholder="Search campaigns..."
                    value={search}
                    onChange={(e) =>
                        setSearch(e.target.value)
                    }
                />


                <select
                    value={category}
                    onChange={(e) =>
                        setCategory(e.target.value)
                    }
                >
                    <option value="All">
                        All Categories
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


                <select
                    value={sortBy}
                    onChange={(e) =>
                        setSortBy(e.target.value)
                    }
                >
                    <option value="urgent">
                        Least Time Left
                    </option>

                    <option value="newest">
                        Newest Campaigns
                    </option>

                    <option value="youngest">
                        Youngest First
                    </option>

                    <option value="oldest">
                        Elders First
                    </option>

                    <option value="goal_low">
                        Goal: Low to High
                    </option>

                    <option value="goal_high">
                        Goal: High to Low
                    </option>

                </select>

            </div>


            <div className="campaign-grid">

                {campaigns.map((campaign) => (
                    <CampaignCard
                        key={campaign.id}
                        campaign={campaign}
                    />
                ))}

            </div>


            {!loading && campaigns.length === 0 && (
                <p className="no-campaigns">
                    No campaigns found.
                </p>
            )}


            <div
                ref={loaderRef}
                className="campaign-loader"
            >
                {loading && (
                    <p>Loading campaigns...</p>
                )}

                {!hasMore &&
                    campaigns.length > 0 && (
                        <p>
                            You've reached the end.
                        </p>
                    )
                }
            </div>

        </div>
    );
}