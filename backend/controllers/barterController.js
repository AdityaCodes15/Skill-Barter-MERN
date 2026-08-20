const BarterRequest = require("../models/BarterRequest");
const User = require("../models/User");

// Send a barter request
const sendRequest = async (req, res) => {
    try {
        const {
            receiverId,
            offeredSkill,
            requestedSkill,
            message
        } = req.body;

        if (!receiverId || !offeredSkill || !requestedSkill) {
            return res.status(400).json({
                message: "Receiver, offered skill and requested skill are required"
            });
        }

        if (receiverId === req.userId) {
            return res.status(400).json({
                message: "You cannot send a request to yourself"
            });
        }

        const receiver = await User.findById(receiverId);

        if (!receiver) {
            return res.status(404).json({
                message: "Receiver not found"
            });
        }

        const existingRequest = await BarterRequest.findOne({
            sender: req.userId,
            receiver: receiverId,
            status: "pending"
        });

        if (existingRequest) {
            return res.status(400).json({
                message: "Request already sent"
            });
        }

        const request = await BarterRequest.create({
            sender: req.userId,
            receiver: receiverId,
            offeredSkill,
            requestedSkill,
            message
        });

        res.status(201).json({
            message: "Barter request sent successfully",
            request
        });

    } catch (error) {
        console.error("Send request error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get received requests
const getReceivedRequests = async (req, res) => {
    try {
        const requests = await BarterRequest.find({
            receiver: req.userId
        })
            .populate("sender", "name email skillsOffered skillsWanted")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get received requests error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get sent requests
const getSentRequests = async (req, res) => {
    try {
        const requests = await BarterRequest.find({
            sender: req.userId
        })
            .populate("receiver", "name email skillsOffered skillsWanted")
            .sort({ createdAt: -1 });

        res.status(200).json({
            count: requests.length,
            requests
        });

    } catch (error) {
        console.error("Get sent requests error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get a single request
const getRequestById = async (req, res) => {
    try {
        const request = await BarterRequest.findOne({
            _id: req.params.id,
            $or: [
                { sender: req.userId },
                { receiver: req.userId }
            ]
        })
            .populate("sender", "name email skillsOffered skillsWanted")
            .populate("receiver", "name email skillsOffered skillsWanted");

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        res.status(200).json({
            request
        });

    } catch (error) {
        console.error("Get request error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Accept or reject request
const updateRequestStatus = async (req, res) => {
    try {
        const { status } = req.body;

        if (!["accepted", "rejected"].includes(status)) {
            return res.status(400).json({
                message: "Status must be accepted or rejected"
            });
        }

        const request = await BarterRequest.findOne({
            _id: req.params.id,
            receiver: req.userId
        });

        if (!request) {
            return res.status(404).json({
                message: "Request not found"
            });
        }

        if (request.status !== "pending") {
            return res.status(400).json({
                message: "Request has already been processed"
            });
        }

        request.status = status;

        await request.save();

        res.status(200).json({
            message: `Request ${status} successfully`,
            request
        });

    } catch (error) {
        console.error("Update request error:", error.message);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    sendRequest,
    getReceivedRequests,
    getSentRequests,
    getRequestById,
    updateRequestStatus
};