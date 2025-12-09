const mongoose = require("mongoose");

const ChatMessageSchema = new mongoose.Schema(
  {
    sender: { type: String, required: true },
    text: { type: String, default: "" },

    image: {
      filename: { type: String, default: null },
      url: { type: String, default: null },
      type: { type: String, default: null }
    },

    status: {
      type: String,
      enum: ["sent", "delivered", "seen"],
      default: "sent"
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatMessage", ChatMessageSchema);
