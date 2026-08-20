const User = require("../models/User");

// Find mutual skill matches
const findMatches = async (req, res) => {
    try {
        const currentUser = await User.findById(req.userId);

        if (!currentUser) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const skillsOffered = currentUser.skillsOffered || [];
        const skillsWanted = currentUser.skillsWanted || [];

        if (skillsOffered.length === 0 || skillsWanted.length === 0) {
            return res.status(200).json({
                message: "Add both offered and wanted skills first",
                matches: []
            });
        }

        const users = await User.find({
            _id: { $ne: req.userId },

            // Other user offers something I want
            skillsOffered: {
                $in: skillsWanted
            },

            // Other user wants something I offer
            skillsWanted: {
                $in: skillsOffered
            }

        }).select("-password");

        res.status(200).json({
            count: users.length,
            matches: users
        });

    } catch (error) {
        console.error("Find matches error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};

module.exports = {
    findMatches
};