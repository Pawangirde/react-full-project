const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const Message = require("../models/Message");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  }
});

const upload = multer({ storage });

// GET all messages
router.get("/", async (req, res) => {
  try {
    const msgs = await Message.find().sort({ timestamp: 1 });
    res.json(msgs);
  } catch (error) {
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
    res.status(500).json({ error: "Failed to create message" });
  }
});

// POST image message
router.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    // Validate file type
    if (!req.file.mimetype.startsWith("image/")) {
      return res.status(400).json({ error: "File must be an image" });
    }

    // Validate file size (max 5MB)
    if (req.file.size > 5 * 1024 * 1024) {
      return res.status(400).json({ error: "Image size must be less than 5MB" });
    }

    const serverUrl = process.env.SERVER_URL || "http://localhost:4000";
    const fileUrl = `${serverUrl}/uploads/${req.file.filename}`;

    const msg = await Message.create({
      sender: "user",
      type: "image",
      content: fileUrl,
      attachment: {
        filename: req.file.filename,
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        size: req.file.size,
        url: fileUrl
      }
    });

    res.json(msg);
  } catch (error) {
    console.error("Upload error:", error);
    res.status(500).json({ error: "Failed to upload image" });
  }
});

module.exports = router;
