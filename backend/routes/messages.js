const express = require("express");
const router = express.Router();
const Message = require("../models/Message");

// GET all messages
router.get("/", async (req, res) => {
  try {
    const msgs = await Message.find().sort({ timestamp: 1 });
    res.json(msgs);
  } catch (error) {
    console.error("Get messages error:", error);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

// POST text message
router.post("/", async (req, res) => {
  try {
    const { sender, type, content } = req.body;

    if (!sender || !type || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const msg = await Message.create({ sender, type, content });
    res.json(msg);
  } catch (error) {
    console.error("Post message error:", error);
    res.status(500).json({ error: "Failed to create message" });
  }
});

// POST image message
router.post("/upload", async (req, res) => {
  try {
    // This will be handled by the upload route middleware
    // But we need to create the message here
    const { sender, type, content, attachment } = req.body;
    
    if (!sender || !type || !content) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const msg = await Message.create({ sender, type, content, attachment });
    res.json(msg);
  } catch (error) {
    console.error("Upload message error:", error);
    res.status(500).json({ error: "Failed to create image message" });
  }
});

module.exports = router;
