const express = require("express");

const {
    sendRequest,
    getReceivedRequests,
    getSentRequests,
    getRequestById,
    updateRequestStatus
} = require("../controllers/barterController");

const protect = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, sendRequest);

router.get("/received", protect, getReceivedRequests);

router.get("/sent", protect, getSentRequests);

router.get("/:id", protect, getRequestById);

router.put("/:id", protect, updateRequestStatus);

module.exports = router;
