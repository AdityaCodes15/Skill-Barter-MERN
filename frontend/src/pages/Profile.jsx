import { useEffect, useState } from "react";
import api from "../services/api";

function Profile() {
    const [profile, setProfile] = useState({
        name: "",
        email: "",
        bio: "",
        location: "",
        skillsOffered: [],
        skillsWanted: []
    });

    const [offeredInput, setOfferedInput] = useState("");
    const [wantedInput, setWantedInput] = useState("");

    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProfile();
    }, []);

    const fetchProfile = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await api.get(
                "/users/profile",
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(response.data.user);

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load profile"
            );
        }
    };

    const handleChange = (e) => {
        setProfile({
            ...profile,
            [e.target.name]: e.target.value
        });
    };

    const addOfferedSkill = () => {
        const skill = offeredInput.trim();

        if (
            skill &&
            !profile.skillsOffered.includes(skill)
        ) {
            setProfile({
                ...profile,
                skillsOffered: [
                    ...profile.skillsOffered,
                    skill
                ]
            });

            setOfferedInput("");
        }
    };

    const addWantedSkill = () => {
        const skill = wantedInput.trim();

        if (
            skill &&
            !profile.skillsWanted.includes(skill)
        ) {
            setProfile({
                ...profile,
                skillsWanted: [
                    ...profile.skillsWanted,
                    skill
                ]
            });

            setWantedInput("");
        }
    };

    const removeOfferedSkill = (skill) => {
        setProfile({
            ...profile,
            skillsOffered:
                profile.skillsOffered.filter(
                    (item) => item !== skill
                )
        });
    };

    const removeWantedSkill = (skill) => {
        setProfile({
            ...profile,
            skillsWanted:
                profile.skillsWanted.filter(
                    (item) => item !== skill
                )
        });
    };

    const handleSave = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        try {
            const token = localStorage.getItem("token");

            const response = await api.put(
                "/users/profile",
                {
                    name: profile.name,
                    bio: profile.bio,
                    location: profile.location,
                    skillsOffered: profile.skillsOffered,
                    skillsWanted: profile.skillsWanted
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setProfile(response.data.user);

            localStorage.setItem(
                "user",
                JSON.stringify(response.data.user)
            );

            setMessage("Profile updated successfully!");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update profile"
            );
        }
    };

    return (
        <div className="profile-page">

            <div className="profile-header">

                <div className="profile-avatar">
                    {profile.name
                        ? profile.name.charAt(0).toUpperCase()
                        : "U"}
                </div>

                <div>
                    <h1>{profile.name}</h1>

                    <p>
                        {profile.email}
                    </p>

                    {profile.location && (
                        <span>
                            📍 {profile.location}
                        </span>
                    )}
                </div>

            </div>

            {message && (
                <div className="profile-message success">
                    {message}
                </div>
            )}

            {error && (
                <div className="profile-message error">
                    {error}
                </div>
            )}

            <form onSubmit={handleSave}>

                <div className="profile-section">

                    <h2>About You</h2>

                    <label>Name</label>

                    <input
                        type="text"
                        name="name"
                        value={profile.name || ""}
                        onChange={handleChange}
                    />

                    <label>Email</label>

                    <input
                        type="email"
                        value={profile.email || ""}
                        disabled
                    />

                    <label>Location</label>

                    <input
                        type="text"
                        name="location"
                        value={profile.location || ""}
                        onChange={handleChange}
                        placeholder="e.g. Delhi, India"
                    />

                    <label>Bio</label>

                    <textarea
                        name="bio"
                        value={profile.bio || ""}
                        onChange={handleChange}
                        placeholder="Tell other learners about yourself..."
                    />

                </div>

                <div className="profile-section">

                    <h2>Skills I Can Teach</h2>

                    <p className="section-description">
                        Add skills that you are confident
                        enough to teach others.
                    </p>

                    <div className="skill-input">

                        <input
                            type="text"
                            value={offeredInput}
                            onChange={(e) =>
                                setOfferedInput(e.target.value)
                            }
                            placeholder="e.g. React"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addOfferedSkill();
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={addOfferedSkill}
                        >
                            Add Skill
                        </button>

                    </div>

                    <div className="skills">

                        {profile.skillsOffered.map(
                            (skill) => (
                                <span key={skill}>
                                    {skill}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeOfferedSkill(
                                                skill
                                            )
                                        }
                                    >
                                        ×
                                    </button>
                                </span>
                            )
                        )}

                    </div>

                </div>

                <div className="profile-section">

                    <h2>Skills I Want to Learn</h2>

                    <p className="section-description">
                        Add skills you want to learn
                        through skill exchange.
                    </p>

                    <div className="skill-input">

                        <input
                            type="text"
                            value={wantedInput}
                            onChange={(e) =>
                                setWantedInput(e.target.value)
                            }
                            placeholder="e.g. Python"
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                    addWantedSkill();
                                }
                            }}
                        />

                        <button
                            type="button"
                            onClick={addWantedSkill}
                        >
                            Add Skill
                        </button>

                    </div>

                    <div className="skills">

                        {profile.skillsWanted.map(
                            (skill) => (
                                <span key={skill}>
                                    {skill}

                                    <button
                                        type="button"
                                        onClick={() =>
                                            removeWantedSkill(
                                                skill
                                            )
                                        }
                                    >
                                        ×
                                    </button>
                                </span>
                            )
                        )}

                    </div>

                </div>

                <button
                    className="save-profile"
                    type="submit"
                >
                    Save Profile
                </button>

            </form>

        </div>
    );
}

export default Profile;