const express = require("express");
const ChatMessage = require("../models/ChatMessage");
const router = express.Router();

router.get("/", async (req, res) => {
  const messages = await ChatMessage.find().sort({ createdAt: 1 });
  res.json(messages);
});

module.exports = router;
