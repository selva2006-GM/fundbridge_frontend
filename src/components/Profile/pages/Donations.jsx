export default function Donations() {

    const donations = [];

    return (
        <div className="profile-page-content">

            <div className="profile-header">

                <div>
                    <h2>My Donations</h2>

                    <p>
                        View campaigns you have supported.
                    </p>
                </div>

            </div>


            {donations.length === 0 ? (

                <div className="empty-campaigns">

                    <h3>No donations yet</h3>

                    <p>
                        Campaigns you support will
                        appear here.
                    </p>

                </div>

            ) : (

                <div className="donations-list">

                    {donations.map((donation) => (

                        <div
                            className="donation-item"
                            key={donation.id}
                        >

                            <div>

                                <h3>
                                    {donation.campaign_title}
                                </h3>

                                <p>
                                    {donation.created_at}
                                </p>

                            </div>


                            <strong>
                                ₹
                                {Number(
                                    donation.amount
                                ).toLocaleString()}
                            </strong>

                        </div>

                    ))}

                </div>

            )}

        </div>
    );
}