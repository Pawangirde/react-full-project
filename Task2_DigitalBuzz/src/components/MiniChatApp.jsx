import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Bot, User, X, Loader2 } from "lucide-react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:4000";
const MSG_API = `${API_BASE}/messages`;
const UPLOAD_API = `${API_BASE}/upload`;
const BOT_API = `${API_BASE}/bot/reply`;

export default function MiniChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    loadMessages();
  }, []);

  const loadMessages = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(MSG_API);
      setMessages(res.data || []);
    } catch (error) {
      console.error("Failed to load messages:", error);
      alert("Failed to load messages.");
    } finally {
      setIsLoading(false);
    }
  };

  const getBotReply = async (userMessage) => {
    try {
      const res = await axios.post(BOT_API, { message: userMessage });
      return res.data.reply || "I'm here to help! 💬";
    } catch (error) {
      console.error("Bot API error:", error);
      // Fallback to local logic if API fails
      return getLocalBotReply(userMessage);
    }
  };

  const getLocalBotReply = (msg) => {
    const t = msg.toLowerCase();
    if (/hello|hi|hey/.test(t)) return "Hello! How can I help? 😊";
    if (/help|what can you do/.test(t)) return "I can chat about React, Firebase & MERN!";
    if (/react/.test(t)) return "React is a UI library using components & hooks. ⚛️";
    if (/firebase/.test(t)) return "Firebase offers Auth, DB, Hosting & more! 🔥";
    if (/thank|thanks/.test(t)) return "You're welcome! 😄";
    if (/bye|goodbye/.test(t)) return "Goodbye! 👋";
    return "Interesting! Tell me more or ask 'help' 💬";
  };

  const sendText = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      type: "text",
      content: input.trim(),
      timestamp: new Date(),
    };

    // Add user message immediately
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    scrollToBottom();

    try {
      // Save user message to DB
      await axios.post(MSG_API, userMsg);
    } catch (error) {
      console.error("Failed to save user message:", error);
    }

    // Show typing indicator
    setIsTyping(true);

    // Get bot reply
    setTimeout(async () => {
      try {
        const botReplyText = await getBotReply(userMsg.content);
        
        const botMsg = {
          sender: "bot",
          type: "text",
          content: botReplyText,
          timestamp: new Date(),
        };

        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
        scrollToBottom();

        // Save bot message to DB
        try {
          await axios.post(MSG_API, botMsg);
        } catch (error) {
          console.error("Failed to save bot message:", error);
        }
      } catch (error) {
        setIsTyping(false);
        console.error("Failed to get bot reply:", error);
      }
    }, 800);
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert("Image size must be less than 5MB.");
      return;
    }
    
    setPreviewFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const sendImage = async () => {
    if (!previewFile) return;

    const formData = new FormData();
    formData.append("image", previewFile);

    try {
      const res = await axios.post(UPLOAD_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      // Add image message to UI
      setMessages((prev) => [...prev, res.data]);
      
      // Clear preview
      setPreview(null);
      setPreviewFile(null);
      if (fileRef.current) fileRef.current.value = "";
      
      scrollToBottom();

      // Bot can respond to images too
      setIsTyping(true);
      setTimeout(async () => {
        const botMsg = {
          sender: "bot",
          type: "text",
          content: "Nice image! 📸 What would you like to chat about?",
          timestamp: new Date(),
        };
        setIsTyping(false);
        setMessages((prev) => [...prev, botMsg]);
        try {
          await axios.post(MSG_API, botMsg);
        } catch (error) {
          console.error("Failed to save bot message:", error);
        }
        scrollToBottom();
      }, 800);
    } catch (error) {
      console.error("Image upload failed:", error);
      alert(error.response?.data?.error || "Image upload failed. Please try again.");
    }
  };

  const cancelPreview = () => {
    setPreview(null);
    setPreviewFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  return (
    <div className="border rounded-xl bg-white shadow flex flex-col w-full max-h-[100vh]">
      {/* Header */}
      <div className="p-4 border-b flex items-center gap-2 bg-gradient-to-r from-blue-50 to-indigo-50">
        <Bot className="w-6 h-6 text-blue-600" />
        <h2 className="font-semibold text-lg text-gray-800">Mini Chat App (MERN)</h2>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4 min-h-0">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
            >
              <div className={`flex gap-2 max-w-[75%] ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"} items-start`}>
                {/* Avatar */}
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  {msg.sender === "user" ? (
                    <User className="w-5 h-5" />
                  ) : (
                    <Bot className="w-5 h-5" />
                  )}
                </div>

                {/* Message Bubble */}
                <div
                  className={`p-3 rounded-2xl shadow-sm ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white rounded-tr-none"
                      : "bg-white border border-gray-200 rounded-tl-none"
                  }`}
                >
                  {msg.type === "image" ? (
                    <div className="space-y-2">
                      <img
                        src={msg.content}
                        alt="Uploaded"
                        className="max-h-64 rounded-lg object-cover"
                        onError={(e) => {
                          e.target.src = "https://via.placeholder.com/300x200?text=Image+Not+Found";
                        }}
                      />
                      {msg.attachment?.originalName && (
                        <p className="text-xs opacity-75 truncate">
                          {msg.attachment.originalName}
                        </p>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                  )}
                  
                  {/* Timestamp */}
                  <p
                    className={`text-xs mt-2 ${
                      msg.sender === "user" ? "text-blue-100" : "text-gray-500"
                    }`}
                  >
                    {new Date(msg.timestamp).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>
            </div>
          ))
        )}

        {/* Typing Indicator */}
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-[75%] items-start">
              <div className="w-10 h-10 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center flex-shrink-0">
                <Bot className="w-5 h-5" />
              </div>
              <div className="p-3 rounded-2xl rounded-tl-none bg-white border border-gray-200 shadow-sm">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t bg-white space-y-2">
        {/* Image Preview */}
        {preview && (
          <div className="relative w-32 h-32 bg-gray-100 border-2 border-blue-300 rounded-lg overflow-hidden shadow-sm">
            <img src={preview} className="w-full h-full object-cover" alt="Preview" />
            <div className="absolute top-1 right-1 flex gap-1">
              <button
                onClick={sendImage}
                className="bg-green-500 hover:bg-green-600 text-white p-1.5 rounded-full shadow transition-colors"
                title="Send image"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={cancelPreview}
                className="bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full shadow transition-colors"
                title="Cancel"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Input Controls */}
        <div className="flex gap-2">
          <input
            type="text"
            className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Type a message..."
            disabled={preview}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !preview && !e.shiftKey) {
                e.preventDefault();
                sendText();
              }
            }}
          />

          <button
            onClick={() => fileRef.current?.click()}
            disabled={preview}
            className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Upload image"
          >
            <ImageIcon className="w-5 h-5 text-gray-600" />
          </button>

          <button
            onClick={sendText}
            disabled={preview || !input.trim()}
            className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            title="Send message"
          >
            <Send className="w-5 h-5" />
          </button>

          <input
            type="file"
            ref={fileRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageSelect}
          />
        </div>
      </div>
    </div>
  );
}
