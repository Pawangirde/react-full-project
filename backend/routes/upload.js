const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const Message = require("../models/Message");
const router = express.Router();

// Ensure assets/images directory exists
const uploadsDir = path.join(__dirname, "..", "assets", "images");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadsDir,
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname.replace(/\s/g, "_"));
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"), false);
    }
  }
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const serverUrl = process.env.SERVER_URL || "http://localhost:4000";
    const fileUrl = `${serverUrl}/images/${req.file.filename}`;

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
