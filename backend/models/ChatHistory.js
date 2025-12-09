const mongoose = require("mongoose");

const ChatHistorySchema = new mongoose.Schema(
  {
    role: { type: String, enum: ["user", "assistant"], required: true },
    message: { type: String, required: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model("ChatHistory", ChatHistorySchema);
