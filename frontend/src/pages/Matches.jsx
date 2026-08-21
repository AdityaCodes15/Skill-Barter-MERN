import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Matches() {
    const navigate = useNavigate();

    const [matches, setMatches] = useState([]);
    const [profile, setProfile] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [selectedSkills, setSelectedSkills] = useState({});

    useEffect(() => {
        fetchMatches();
    }, []);

    const fetchMatches = async () => {
        try {
            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const profileResponse = await api.get(
                "/users/profile",
                config
            );

            setProfile(profileResponse.data.user);

            const matchResponse = await api.get(
                "/matches",
                config
            );

            setMatches(matchResponse.data.matches || []);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load matches"
            );
        } finally {
            setLoading(false);
        }
    };

    const handleSelection = (userId, field, value) => {
        setSelectedSkills((previous) => ({
            ...previous,
            [userId]: {
                ...previous[userId],
                [field]: value
            }
        }));
    };

    const sendRequest = async (match) => {
        try {
            setMessage("");
            setError("");

            const token = localStorage.getItem("token");

            const selection =
                selectedSkills[match._id];

            if (
                !selection?.offeredSkill ||
                !selection?.requestedSkill
            ) {
                setError(
                    "Please select both skills before sending a request."
                );
                return;
            }

            await api.post(
                "/barter",
                {
                    receiverId: match._id,
                    offeredSkill: selection.offeredSkill,
                    requestedSkill: selection.requestedSkill,
                    message:
                        "I would like to exchange skills with you."
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                `Barter request sent to ${match.name}!`
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to send barter request"
            );
        }
    };

    if (loading) {
        return (
            <div className="matches-page">
                <div className="page-heading">
                    <p className="page-label">
                        DISCOVER
                    </p>

                    <h1>Find Skill Matches</h1>

                    <p>
                        Finding people whose skills
                        complement yours...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="matches-page">

            <div className="page-heading">

                <p className="page-label">
                    DISCOVER
                </p>

                <h1>
                    Find Skill Matches
                </h1>

                <p>
                    Connect with people whose skills
                    complement yours.
                </p>

            </div>

            {message && (
                <div className="alert success">
                    {message}
                </div>
            )}

            {error && (
                <div className="alert error">
                    {error}
                </div>
            )}

            {matches.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-icon">
                        🔍
                    </div>

                    <h2>
                        No matches found
                    </h2>

                    <p>
                        Add skills you can teach and
                        skills you want to learn
                        to discover potential matches.
                    </p>

                </div>

            ) : (

                <div className="match-grid">

                    {matches.map((match) => {

                        const selection =
                            selectedSkills[match._id] || {};

                        return (
                            <div
                                className="match-card"
                                key={match._id}
                            >

                                <div className="match-header">

                                    <div className="match-avatar">
                                        {match.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h2>
                                            {match.name}
                                        </h2>

                                        <p>
                                            {match.email}
                                        </p>
                                    </div>

                                </div>

                                <div className="match-section">

                                    <h3>
                                        Can Teach
                                    </h3>

                                    <div className="skill-list">

                                        {match.skillsOffered?.map(
                                            (skill) => (
                                                <span key={skill}>
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                                <div className="match-section">

                                    <h3>
                                        Wants to Learn
                                    </h3>

                                    <div className="skill-list">

                                        {match.skillsWanted?.map(
                                            (skill) => (
                                                <span key={skill}>
                                                    {skill}
                                                </span>
                                            )
                                        )}

                                    </div>

                                </div>

                                <div className="exchange-box">

                                    <h3>
                                        Create Exchange
                                    </h3>

                                    <label>
                                        I will teach
                                    </label>

                                    <select
                                        value={
                                            selection.offeredSkill ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleSelection(
                                                match._id,
                                                "offeredSkill",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select your skill
                                        </option>

                                        {profile?.skillsOffered?.map(
                                            (skill) => (
                                                <option
                                                    key={skill}
                                                    value={skill}
                                                >
                                                    {skill}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <label>
                                        I want to learn
                                    </label>

                                    <select
                                        value={
                                            selection.requestedSkill ||
                                            ""
                                        }
                                        onChange={(e) =>
                                            handleSelection(
                                                match._id,
                                                "requestedSkill",
                                                e.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select their skill
                                        </option>

                                        {match.skillsOffered?.map(
                                            (skill) => (
                                                <option
                                                    key={skill}
                                                    value={skill}
                                                >
                                                    {skill}
                                                </option>
                                            )
                                        )}
                                    </select>

                                    <button
                                        onClick={() =>
                                            sendRequest(match)
                                        }
                                    >
                                        Send Barter Request
                                    </button>

                                <button
    className="chat-button"
    onClick={() =>
        navigate("/chat", {
            state: {
                user: match
            }
        })
    }
>
    💬 Chat
</button>

                                </div>

                            </div>
                        );
                    })}

                </div>
            )}

        </div>
    );
}

export default Matches;