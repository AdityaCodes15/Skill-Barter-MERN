import { Link, useNavigate } from "react-router-dom";

function Navbar() {

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        navigate("/login");
    };

    return (
        <nav className="navbar">

            <Link
                to="/dashboard"
                className="navbar-logo"
            >
                Skill<span>Barter</span>
            </Link>

            <div className="navbar-links">

                <Link to="/dashboard">
                    Dashboard
                </Link>

                <Link to="/profile">
                    Profile
                </Link>

                <Link to="/matches">
                    Find Matches
                </Link>

                <Link to="/requests">
                    Requests
                </Link>

                <button onClick={logout}>
                    Logout
                </button>

            </div>

        </nav>
    );
}

export default Navbar;