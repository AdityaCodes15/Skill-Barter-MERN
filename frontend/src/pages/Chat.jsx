import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import api from "../services/api";

const SOCKET_URL = "https://skill-barter-mern.onrender.com";

function Chat() {
    const location = useLocation();
    const navigate = useNavigate();

    const otherUser = location.state?.user;

    const [messages, setMessages] = useState([]);
    const [messageText, setMessageText] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const socketRef = useRef(null);
    const messagesEndRef = useRef(null);

    const currentUser = JSON.parse(
        localStorage.getItem("user")
    );

    const currentUserId = currentUser?.id;
    const otherUserId = otherUser?._id || otherUser?.id;

    useEffect(() => {
        if (!otherUserId) {
            navigate("/matches");
            return;
        }

        const token = localStorage.getItem("token");

        const fetchMessages = async () => {
            try {
                const response = await api.get(
                    `/messages/${otherUserId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setMessages(response.data.messages || []);

            } catch (error) {
                setError(
                    error.response?.data?.message ||
                    "Failed to load messages"
                );
            } finally {
                setLoading(false);
            }
        };

        fetchMessages();

        const socket = io(SOCKET_URL);

        socketRef.current = socket;

        socket.on("connect", () => {
            socket.emit("join", currentUserId);
        });

        socket.on("receiveMessage", (newMessage) => {

            if (
                newMessage.senderId === otherUserId
            ) {
                setMessages((previous) => [
                    ...previous,
                    newMessage
                ]);
            }
        });

        return () => {
            socket.disconnect();
        };

    }, [otherUserId, currentUserId, navigate]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth"
        });
    }, [messages]);

    const sendMessage = async (e) => {
        e.preventDefault();

        const text = messageText.trim();

        if (!text || !otherUserId) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await api.post(
                "/messages",
                {
                    receiverId: otherUserId,
                    message: text
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            const savedMessage =
                response.data.data;

            setMessages((previous) => [
                ...previous,
                savedMessage
            ]);

            socketRef.current?.emit(
                "sendMessage",
                {
                    senderId: currentUserId,
                    receiverId: otherUserId,
                    message: text
                }
            );

            setMessageText("");

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to send message"
            );
        }
    };

    if (!otherUser) {
        return null;
    }

    return (
        <div className="chat-page">

            <div className="chat-container">

                <div className="chat-header">

                    <button
                        className="chat-back"
                        onClick={() =>
                            navigate("/matches")
                        }
                    >
                        ←
                    </button>

                    <div className="chat-avatar">
                        {otherUser.name
                            ?.charAt(0)
                            .toUpperCase()}
                    </div>

                    <div>
                        <h2>
                            {otherUser.name}
                        </h2>

                        <p>
                            {otherUser.email}
                        </p>
                    </div>

                </div>

                {error && (
                    <div className="alert error">
                        {error}
                    </div>
                )}

                <div className="chat-messages">

                    {loading ? (

                        <div className="chat-empty">
                            Loading conversation...
                        </div>

                    ) : messages.length === 0 ? (

                        <div className="chat-empty">

                            <div>
                                💬
                            </div>

                            <h3>
                                Start the conversation
                            </h3>

                            <p>
                                Say hello and start
                                exchanging skills.
                            </p>

                        </div>

                    ) : (

                        messages.map((message, index) => {

                            const senderId =
                                message.sender?._id ||
                                message.senderId;

                            const isMine =
                                String(senderId) ===
                                String(currentUserId);

                            return (
                                <div
                                    key={
                                        message._id ||
                                        index
                                    }
                                    className={
                                        isMine
                                            ? "chat-message mine"
                                            : "chat-message"
                                    }
                                >

                                    <div className="message-bubble">
                                        {message.message}
                                    </div>

                                    {message.createdAt && (
                                        <small>
                                            {new Date(
                                                message.createdAt
                                            ).toLocaleTimeString(
                                                [],
                                                {
                                                    hour: "2-digit",
                                                    minute: "2-digit"
                                                }
                                            )}
                                        </small>
                                    )}

                                </div>
                            );
                        })
                    )}

                    <div ref={messagesEndRef} />

                </div>

                <form
                    className="chat-input-area"
                    onSubmit={sendMessage}
                >

                    <input
                        type="text"
                        value={messageText}
                        onChange={(e) =>
                            setMessageText(
                                e.target.value
                            )
                        }
                        placeholder="Type a message..."
                        maxLength={1000}
                    />

                    <button type="submit">
                        Send
                    </button>

                </form>

            </div>

        </div>
    );
}

export default Chat;