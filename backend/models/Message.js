const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: { 
    type: String, 
    required: true,
    enum: ["user", "bot"],
    default: "user"
  },
  type: { 
    type: String, 
    required: true,
    enum: ["text", "image"],
    default: "text"
  },
  content: { 
    type: String, 
    required: true 
  },
  // For image attachments
  attachment: {
    filename: String,
    originalName: String,
    mimeType: String,
    size: Number,
    url: String
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  }
}, {
  timestamps: true 
});

module.exports = mongoose.model("Message", MessageSchema);
