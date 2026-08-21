const express = require("express");
const cors = require("cors");
require("dotenv").config();

const http = require("http");
const { Server } = require("socket.io");

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const matchRoutes = require("./routes/matchRoutes");
const barterRoutes = require("./routes/barterRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "*",
        methods: ["GET", "POST"]
    }
});

// Connect MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/matches", matchRoutes);
app.use("/api/barter", barterRoutes);
app.use("/api/messages", messageRoutes);

// Test route
app.get("/", (req, res) => {
    res.json({
        message: "Skill Barter API is running"
    });
});

// Socket.IO
io.on("connection", (socket) => {

    console.log(
        "User connected:",
        socket.id
    );

    socket.on("join", (userId) => {

        socket.join(userId);

        console.log(
            `User ${userId} joined their room`
        );
    });

    socket.on("sendMessage", (data) => {

        const {
            senderId,
            receiverId,
            message
        } = data;

        io.to(receiverId).emit(
            "receiveMessage",
            {
                senderId,
                receiverId,
                message,
                createdAt: new Date()
            }
        );
    });

    socket.on("disconnect", () => {

        console.log(
            "User disconnected:",
            socket.id
        );
    });

});

// Render provides PORT in production
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});