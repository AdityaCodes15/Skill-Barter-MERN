const User = require("../models/User");

// Get logged-in user's profile
const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.status(200).json({
            user
        });

    } catch (error) {
        console.error("Get profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Update logged-in user's profile
const updateProfile = async (req, res) => {
    try {
        const {
            name,
            bio,
            location,
            skillsOffered,
            skillsWanted
        } = req.body;

        const user = await User.findById(req.userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Update only fields that are provided
        if (name !== undefined) {
            user.name = name;
        }

        if (bio !== undefined) {
            user.bio = bio;
        }

        if (location !== undefined) {
            user.location = location;
        }

        if (skillsOffered !== undefined) {
            user.skillsOffered = skillsOffered;
        }

        if (skillsWanted !== undefined) {
            user.skillsWanted = skillsWanted;
        }

        const updatedUser = await user.save();

        res.status(200).json({
            message: "Profile updated successfully",
            user: {
                id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                bio: updatedUser.bio,
                location: updatedUser.location,
                skillsOffered: updatedUser.skillsOffered,
                skillsWanted: updatedUser.skillsWanted
            }
        });

    } catch (error) {
        console.error("Update profile error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    getProfile,
    updateProfile
};