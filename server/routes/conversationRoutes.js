const express = require("express");
const conversationController = require("../controllers/conversationController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/", conversationController.getConversations);
router.post("/", conversationController.createOrGetConversation);
router.get("/:conversationId/messages", conversationController.getMessages);

module.exports = router;
