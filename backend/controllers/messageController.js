const Message = require("../models/Message");

// Send a message
const sendMessage = async (req, res) => {
    try {
        const senderId = req.user.userId;
        const { receiverId, message } = req.body;

        if (!receiverId || !message?.trim()) {
            return res.status(400).json({
                message: "Receiver and message are required"
            });
        }

        const newMessage = await Message.create({
            sender: senderId,
            receiver: receiverId,
            message: message.trim()
        });

        const populatedMessage =
            await Message.findById(newMessage._id)
                .populate("sender", "name email")
                .populate("receiver", "name email");

        res.status(201).json({
            message: "Message sent successfully",
            data: populatedMessage
        });

    } catch (error) {
        console.error("Send message error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


// Get conversation between two users
const getConversation = async (req, res) => {
    try {
        const currentUserId = req.user.userId;
        const { userId } = req.params;

        const messages = await Message.find({
            $or: [
                {
                    sender: currentUserId,
                    receiver: userId
                },
                {
                    sender: userId,
                    receiver: currentUserId
                }
            ]
        })
            .populate("sender", "name email")
            .populate("receiver", "name email")
            .sort({ createdAt: 1 });

        res.json({
            messages
        });

    } catch (error) {
        console.error("Get conversation error:", error);

        res.status(500).json({
            message: "Server error"
        });
    }
};


module.exports = {
    sendMessage,
    getConversation
};