const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true
        },

        skillsOffered: [
            {
                type: String,
                trim: true
            }
        ],

        skillsWanted: [
            {
                type: String,
                trim: true
            }
        ],

        bio: {
            type: String,
            default: ""
        },

        location: {
            type: String,
            default: ""
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model("User", userSchema);