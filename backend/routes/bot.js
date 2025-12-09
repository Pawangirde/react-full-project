const express = require("express");
const router = express.Router();

function getBotReply(userMessage) {
  const msg = userMessage.toLowerCase().trim();
  
  // Greetings
  if (/hello|hi|hey|greetings|good morning|good afternoon|good evening/.test(msg)) {
    return "Hello! How can I help you today? 😊";
  }
  
  // Help commands
  if (/help|what can you do|commands|what do you do/.test(msg)) {
    return "I'm a local AI bot! I can chat about React, Firebase, MERN stack, and general topics. Try asking me about web development! 💬";
  }
  
  // React related
  if (/react|jsx|component|hook|useState|useEffect/.test(msg)) {
    return "React is a JavaScript library for building user interfaces! It uses components, hooks, and a virtual DOM. Want to know more about a specific React topic? ⚛️";
  }
  
  // Firebase related
  if (/firebase|firestore|realtime database|authentication|auth/.test(msg)) {
    return "Firebase is Google's platform for building apps! It offers Authentication, Firestore, Realtime Database, Cloud Functions, and Hosting. What would you like to know? 🔥";
  }
  
  // MERN stack
  if (/mern|mongodb|express|node|nodejs/.test(msg)) {
    return "MERN stands for MongoDB, Express, React, and Node.js - a full-stack JavaScript solution! Each part handles different layers of the application. 🚀";
  }
  
  // Questions
  if (/\?/.test(msg) || /what|how|why|when|where|who/.test(msg)) {
    if (/what.*react/.test(msg)) {
      return "React is a library for building interactive UIs using components and a declarative approach!";
    }
    if (/what.*firebase/.test(msg)) {
      return "Firebase is a Backend-as-a-Service platform providing databases, auth, hosting, and more!";
    }
    if (/what.*mern/.test(msg)) {
      return "MERN is a full-stack JavaScript framework combining MongoDB, Express, React, and Node.js!";
    }
    return "That's an interesting question! I can help with React, Firebase, MERN stack, or general web development topics. Ask me something specific! 🤔";
  }
  
  // Thanks
  if (/thank|thanks|appreciate|grateful/.test(msg)) {
    return "You're welcome! Happy to help! 😄";
  }
  
  // Goodbye
  if (/bye|goodbye|see you|farewell|exit|quit/.test(msg)) {
    return "Goodbye! Have a great day! 👋";
  }
  
  // Default responses
  const defaultReplies = [
    "That's interesting! Tell me more or ask about React, Firebase, or MERN stack! 💬",
    "I'm here to help! Try asking about web development, React, or Firebase! 🚀",
    "Hmm, I'm a simple bot focused on web development. Ask me about React, Firebase, or the MERN stack! 💡",
    "I can chat about React, Firebase, MERN stack, and general web development topics. What would you like to know? 🤓"
  ];
  
  return defaultReplies[Math.floor(Math.random() * defaultReplies.length)];
}

router.post("/reply", (req, res) => {
  try {
    const { message } = req.body;
    
    if (!message || !message.trim()) {
      return res.status(400).json({ error: "Message is required" });
    }
    
    const botReply = getBotReply(message);
    
    res.json({ reply: botReply });
  } catch (error) {
    console.error("Bot error:", error);
    res.status(500).json({ error: "Failed to generate bot reply" });
  }
});

module.exports = router;

