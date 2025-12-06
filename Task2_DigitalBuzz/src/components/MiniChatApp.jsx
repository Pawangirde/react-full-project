import React, { useState, useEffect, useRef } from "react";
import { Send, Image as ImageIcon, Bot, User, X } from "lucide-react";
import { getMessages, postMessage, uploadImage } from "../services/api";

export default function MiniChatApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [preview, setPreview] = useState(null);
  const [isTyping, setIsTyping] = useState(false);

  const fileRef = useRef(null);
  const bottomRef = useRef(null);

  const scrollToBottom = () =>
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (isTyping) scrollToBottom();
  }, [isTyping]);

  const loadMessages = async () => {
    try {
      const res = await getMessages();
      setMessages(res.data || []);
      scrollToBottom();
    } catch {
      alert("Failed to load messages.");
    }
  };

  useEffect(() => {
    loadMessages();
  }, []);

  const getBotReply = (msg) => {
    const t = msg.toLowerCase();
    const rules = [
      { match: /hello|hi|hey/, reply: "Hello! How can I help? 😊" },
      {
        match: /help|what can you do/,
        reply: "I can chat about React, Firebase & MERN!",
      },
      {
        match: /react/,
        reply: "React is a UI library using components & hooks. ⚛️",
      },
      {
        match: /firebase/,
        reply: "Firebase offers Auth, DB, Hosting & more! 🔥",
      },
      { match: /thank|thanks/, reply: "You're welcome! 😄" },
      { match: /bye|goodbye/, reply: "Goodbye! 👋" },
      { match: /\?/, reply: "Ask me anything about React or Firebase!" },
    ];
    for (let r of rules) if (r.match.test(t)) return r.reply;
    return "Interesting! Tell me more or ask 'help' 💬";
  };

  const sendText = async () => {
    if (!input.trim()) return;

    const userMsg = {
      sender: "user",
      type: "text",
      content: input,
      timestamp: new Date(),
    };
    setMessages((p) => [...p, userMsg]);
    scrollToBottom();
    setInput("");

    try {
      await postMessage(userMsg);
    } catch {}

    // Bot typing
    setIsTyping(true);

    setTimeout(async () => {
      const botMsg = {
        sender: "bot",
        type: "text",
        content: getBotReply(userMsg.content),
        timestamp: new Date(),
      };

      setIsTyping(false);
      setMessages((p) => [...p, botMsg]);
      scrollToBottom();

      try {
        await postMessage(botMsg);
      } catch (err) {
        console.error("Failed to send bot message:", err);
      }
    }, 900);
  };

  const handleImageSelect = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) return alert("Select a valid image.");
    if (f.size > 5 * 1024 * 1024) return alert("Max 5MB allowed.");
    setPreview(URL.createObjectURL(f));
  };

  const sendImage = async () => {
    const file = fileRef.current.files[0];
    if (!file) return;

    const fd = new FormData();
    fd.append("image", file);

    try {
      await uploadImage(fd);
      setPreview(null);
      fileRef.current.value = "";
      loadMessages();
    } catch {
      alert("Image upload failed.");
    }
  };

  return (
    <div className="border rounded-xl bg-white shadow flex flex-col w-full  max-h-[100vh]">
     
      <div className="p-4 border-b flex items-center gap-2 bg-gray-50">
        <Bot className="w-5 h-5 text-blue-600" />
        <h2 className="font-semibold text-lg">Mini Chat App (MERN)</h2>
      </div>

      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${
              msg.sender === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div className="flex gap-2 max-w-xs items-start">
            
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-300 text-gray-700"
                }`}
              >
                {msg.sender === "user" ? <User /> : <Bot />}
              </div>

          
              <div
                className={`p-3 rounded-lg ${
                  msg.sender === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white border"
                }`}
              >
                {msg.type === "image" ? (
                  <img src={msg.content} className="max-h-48 rounded" alt="" />
                ) : (
                  <p>{msg.content}</p>
                )}

                <p className="text-xs opacity-60 mt-1">
                  {new Date(msg.timestamp).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </div>
          </div>
        ))}

       
        {isTyping && (
          <div className="flex justify-start">
            <div className="flex gap-2 max-w-xs items-start">
              <div className="w-8 h-8 rounded-full bg-gray-300 text-gray-700 flex items-center justify-center">
                <Bot className="w-4 h-4" />
              </div>

              <div className="p-3 rounded-lg bg-white border flex flex-col">
                <div className="flex gap-1 items-center">
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-150" />
                  <div className="w-2 h-2 bg-gray-500 rounded-full animate-bounce delay-300" />
                </div>
                <div className="text-xs text-gray-500 mt-1">typing...</div>
              </div>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

     
      <div className="p-4 border-t bg-white space-y-2">
       
        {preview && (
          <div className="relative w-32 h-32 bg-gray-100 border rounded-lg overflow-hidden">
            <img src={preview} className="w-full h-full object-cover" alt="" />
            <div className="absolute top-1 right-1 flex gap-1">
              <button
                onClick={sendImage}
                className="bg-green-500 text-white p-1 rounded"
              >
                <Send className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  setPreview(null);
                  fileRef.current.value = "";
                }}
                className="bg-red-500 text-white p-1 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

      
        <div className="flex gap-2">
          <input
            className="flex-1 border rounded px-3 py-2"
            placeholder="Type a message..."
            disabled={preview}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !preview && sendText()}
          />

          <button
            onClick={() => fileRef.current.click()}
            className="p-2 border rounded hover:bg-gray-100"
          >
            <ImageIcon className="w-5 h-5" />
          </button>

          <button
            onClick={sendText}
            disabled={preview}
            className="p-2 bg-blue-600 text-white rounded"
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
