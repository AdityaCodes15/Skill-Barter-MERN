import { Link } from "react-router-dom";

function Dashboard() {

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    return (
        <div className="dashboard">

            <main className="dashboard-content">

                <div className="dashboard-hero">

                    <p className="dashboard-label">
                        SKILL EXCHANGE PLATFORM
                    </p>

                    <h1>
                        Welcome, {user?.name}
                    </h1>

                    <p>
                        Exchange what you know.
                        Learn what you want.
                        Connect with the right people.
                    </p>

                </div>

                <div className="dashboard-cards">

                    <Link
                        to="/profile"
                        className="dashboard-card"
                    >
                        <div className="card-icon">
                            👤
                        </div>

                        <h3>
                            My Profile
                        </h3>

                        <p>
                            Manage your profile,
                            skills and learning goals.
                        </p>

                        <span>
                            View Profile →
                        </span>
                    </Link>

                    <Link
                        to="/matches"
                        className="dashboard-card"
                    >
                        <div className="card-icon">
                            🤝
                        </div>

                        <h3>
                            Find Matches
                        </h3>

                        <p>
                            Discover people whose
                            skills complement yours.
                        </p>

                        <span>
                            Explore Matches →
                        </span>
                    </Link>

                    <Link
                        to="/requests"
                        className="dashboard-card"
                    >
                        <div className="card-icon">
                            💬
                        </div>

                        <h3>
                            Barter Requests
                        </h3>

                        <p>
                            Send, receive and manage
                            skill exchange requests.
                        </p>

                        <span>
                            View Requests →
                        </span>
                    </Link>

                </div>

            </main>

        </div>
    );
}

export default Dashboard;   