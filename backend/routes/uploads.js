const express = require("express");
const multer = require("multer");
const path = require("path");

const router = express.Router();

// Store images inside /uploads folder
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "..", "uploads")); // FOLDER: /server/uploads
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

// POST /uploads/image
router.post("/image", upload.single("image"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: "No image uploaded" });
  }

  res.json({
    filename: req.file.filename,
    url: `http://localhost:4000/uploads/${req.file.filename}`, // public URL
    type: "image",
  });
});

module.exports = router;
