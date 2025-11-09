const express = require("express");
const authController = require("../controllers/authController");
const notificationController = require("../controllers/notificationController");
const router = express.Router();

router.use(authController.protect);

router.get("/", notificationController.getNotifications);
router.get("/unread-count", notificationController.getUnreadCount);
router.patch("/mark-all-read", notificationController.markAllAsRead);
router.patch("/:id/read", notificationController.markAsRead);

module.exports = router;
