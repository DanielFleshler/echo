const express = require("express");
const roomController = require("../controllers/roomController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);

router.get("/", roomController.getAllRooms);
router.get("/:id", roomController.getRoomById);
router.get("/:id/messages", roomController.getRoomMessages);
router.post("/", roomController.createRoom);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
