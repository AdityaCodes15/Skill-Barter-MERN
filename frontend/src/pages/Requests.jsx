import { useEffect, useState } from "react";
import api from "../services/api";

function Requests() {
    const [received, setReceived] = useState([]);
    const [sent, setSent] = useState([]);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchRequests();
    }, []);

    const fetchRequests = async () => {
        try {
            const token = localStorage.getItem("token");

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            };

            const receivedResponse = await api.get(
                "/barter/received",
                config
            );

            const sentResponse = await api.get(
                "/barter/sent",
                config
            );

            setReceived(
                receivedResponse.data.requests || []
            );

            setSent(
                sentResponse.data.requests || []
            );

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to load requests"
            );
        }
    };

    const updateStatus = async (requestId, status) => {
        try {
            setError("");
            setMessage("");

            const token = localStorage.getItem("token");

            await api.put(
                `/barter/${requestId}`,
                { status },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setMessage(
                `Request ${status} successfully!`
            );

            fetchRequests();

        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Failed to update request"
            );
        }
    };

    const getStatusClass = (status) => {
        if (status === "accepted") return "status accepted";
        if (status === "rejected") return "status rejected";
        return "status pending";
    };

    return (
        <div className="requests-page">

            <div className="page-heading">

                <p className="page-label">
                    ACTIVITY
                </p>

                <h1>
                    Barter Requests
                </h1>

                <p>
                    Manage your skill exchange requests.
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

            {/* RECEIVED REQUESTS */}

            <section className="request-section">

                <div className="section-title">

                    <h2>
                        Received Requests
                    </h2>

                    <span>
                        {received.length}
                    </span>

                </div>

                {received.length === 0 ? (

                    <div className="empty-request">
                        <p>
                            You don't have any received
                            requests yet.
                        </p>
                    </div>

                ) : (

                    <div className="request-grid">

                        {received.map((request) => (

                            <div
                                className="request-card"
                                key={request._id}
                            >

                                <div className="request-person">

                                    <div className="request-avatar">
                                        {request.sender?.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h3>
                                            {request.sender?.name}
                                        </h3>

                                        <p>
                                            {request.sender?.email}
                                        </p>
                                    </div>

                                </div>

                                <div className="exchange-details">

                                    <div>
                                        <small>
                                            THEY OFFER
                                        </small>

                                        <strong>
                                            {request.offeredSkill}
                                        </strong>
                                    </div>

                                    <span className="exchange-arrow">
                                        ⇄
                                    </span>

                                    <div>
                                        <small>
                                            THEY WANT
                                        </small>

                                        <strong>
                                            {request.requestedSkill}
                                        </strong>
                                    </div>

                                </div>

                                {request.message && (
                                    <p className="request-message">
                                        "{request.message}"
                                    </p>
                                )}

                                <div className="request-footer">

                                    <span
                                        className={getStatusClass(
                                            request.status
                                        )}
                                    >
                                        {request.status}
                                    </span>

                                    {request.status === "pending" && (

                                        <div className="request-actions">

                                            <button
                                                onClick={() =>
                                                    updateStatus(
                                                        request._id,
                                                        "accepted"
                                                    )
                                                }
                                            >
                                                Accept
                                            </button>

                                            <button
                                                className="reject-button"
                                                onClick={() =>
                                                    updateStatus(
                                                        request._id,
                                                        "rejected"
                                                    )
                                                }
                                            >
                                                Reject
                                            </button>

                                        </div>

                                    )}

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

            {/* SENT REQUESTS */}

            <section className="request-section">

                <div className="section-title">

                    <h2>
                        Sent Requests
                    </h2>

                    <span>
                        {sent.length}
                    </span>

                </div>

                {sent.length === 0 ? (

                    <div className="empty-request">
                        <p>
                            You haven't sent any requests yet.
                        </p>
                    </div>

                ) : (

                    <div className="request-grid">

                        {sent.map((request) => (

                            <div
                                className="request-card"
                                key={request._id}
                            >

                                <div className="request-person">

                                    <div className="request-avatar">
                                        {request.receiver?.name
                                            ?.charAt(0)
                                            .toUpperCase()}
                                    </div>

                                    <div>
                                        <h3>
                                            {request.receiver?.name}
                                        </h3>

                                        <p>
                                            {request.receiver?.email}
                                        </p>
                                    </div>

                                </div>

                                <div className="exchange-details">

                                    <div>
                                        <small>
                                            YOU OFFER
                                        </small>

                                        <strong>
                                            {request.offeredSkill}
                                        </strong>
                                    </div>

                                    <span className="exchange-arrow">
                                        ⇄
                                    </span>

                                    <div>
                                        <small>
                                            YOU WANT
                                        </small>

                                        <strong>
                                            {request.requestedSkill}
                                        </strong>
                                    </div>

                                </div>

                                <div className="request-footer">

                                    <span
                                        className={getStatusClass(
                                            request.status
                                        )}
                                    >
                                        {request.status}
                                    </span>

                                </div>

                            </div>

                        ))}

                    </div>

                )}

            </section>

        </div>
    );
}

export default Requests;