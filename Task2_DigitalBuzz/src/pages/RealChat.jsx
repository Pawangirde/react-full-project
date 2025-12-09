import React, { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import "../index.css"; // Tailwind

const socket = io("http://localhost:4000");

export default function MiniChat() {
  const [username, setUsername] = useState("");
  const [joined, setJoined] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [typingUser, setTypingUser] = useState("");
  const [text, setText] = useState("");
  const [preview, setPreview] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const chatRef = useRef(null);

  const scrollBottom = () => {
    requestAnimationFrame(() => {
      chatRef.current?.scrollTo({
        top: chatRef.current.scrollHeight,
        behavior: "smooth",
      });
    });
  };

  
  useEffect(() => {
    scrollBottom();
  }, [messages]);

  
  useEffect(() => {
    scrollBottom();
  }, [typingUser]);

 
  useEffect(() => {
    scrollBottom();
  }, [preview]);

  useEffect(() => {
   
    const savedUser = localStorage.getItem("chatUser");
    if (savedUser) {
      setUsername(savedUser);
      setJoined(true);
      socket.emit("join", savedUser);
    }

    fetch("/chat")
      .then((res) => res.json())
      .then((data) => setMessages(data));

    socket.on("onlineUsers", setOnlineUsers);

    socket.on("newMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("typing", (name) => {
      if (name !== username) setTypingUser(name);
    });

    socket.on("stopTyping", () => setTypingUser(""));

    return () => {
      socket.off("onlineUsers");
      socket.off("newMessage");
      socket.off("typing");
      socket.off("stopTyping");
    };
  }, [username]);

  const joinChat = () => {
    if (!username.trim()) return;
    setJoined(true);
    socket.emit("join", username);
    localStorage.setItem("chatUser", username);
  };

  const uploadImage = async () => {
    if (!imageFile) return null;

    const form = new FormData();
    form.append("image", imageFile);

    const res = await fetch("http://localhost:4000/uploads/image", {
      method: "POST",
      body: form,
    });

    return await res.json();
  };

  const sendMessage = async () => {
    if (!text && !imageFile) return;

    let image = imageFile ? await uploadImage() : null;

    const msg = { sender: username, text, image };
    socket.emit("sendMessage", msg);

    setText("");
    setImageFile(null);
    setPreview("");
    socket.emit("stopTyping");
  };

  const onFileSelect = (e) => {
    let file = e.target.files[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };


  if (!joined) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <div className="bg-white p-8 shadow rounded-xl w-80 text-center">
          <h2 className="text-xl font-semibold mb-4">Enter Your Name</h2>
          <input
            className="border w-full px-3 py-2 rounded-md mb-4"
            placeholder="Your name..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <button
            onClick={joinChat}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Join Chat
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className="flex h-screen bg-gray-100">

   
      <aside className="hidden sm:block w-64 bg-white shadow-lg p-5 border-r">
        <h3 className="font-bold text-xl mb-4">Online Users</h3>
        <ul className="space-y-2">
          {onlineUsers.map((u, i) => (
            <li
              key={i}
              className={`p-2 rounded-md ${
                u === username
                  ? "bg-blue-100 text-blue-700 font-semibold"
                  : "bg-gray-100"
              }`}
            >
              {u}
            </li>
          ))}
        </ul>
      </aside>

      <div className="flex flex-col flex-1">

      
        <header className="bg-white shadow p-4 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Mini Real-Time Chat</h2>
          <span className="text-sm text-gray-500">
            {onlineUsers.length} online
          </span>
        </header>

       
        <div
          ref={chatRef}
          className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50"
        >
          {messages.map((msg, i) => {
            const isMe = msg.sender === username;
            const isSystem = msg.sender === "system";

            return (
              <div
                key={i}
                className={`flex flex-col max-w-[75%] ${
                  isSystem
                    ? "mx-auto items-center"
                    : isMe
                    ? "ml-auto items-end"
                    : "mr-auto"
                }`}
              >
                <div
                  className={`p-3 rounded-2xl shadow ${
                    isSystem
                      ? "bg-yellow-100 text-gray-700 italic text-sm"
                      : isMe
                      ? "bg-blue-500 text-white"
                      : "bg-white"
                  }`}
                >
                  {isSystem ? (
                    <span>{msg.text}</span>
                  ) : (
                    <>
                      <span className="font-semibold text-sm">
                        {msg.sender}
                      </span>
                      <p className="mt-1 break-words">{msg.text}</p>

                      {msg.image?.url && (
                        <img
                          src={msg.image.url}
                          className="rounded-lg mt-2 w-48 border"
                          alt=""
                        />
                      )}
                    </>
                  )}
                </div>

                <small className="text-gray-500 mt-1 text-xs">
                  {new Date(msg.createdAt).toLocaleTimeString()}
                </small>
              </div>
            );
          })}

      
          {typingUser && typingUser !== username && (
            <div className="flex items-center gap-2 text-gray-500 italic ml-4">
              <span>{typingUser} is typing</span>
              <span className="animate-pulse">...</span>
            </div>
          )}

       
          {preview && (
            <div className="bg-white shadow-md p-3 rounded-xl w-40">
              <img src={preview} className="rounded-lg" alt="preview" />
              <button
                className="text-red-500 mt-2 text-sm font-semibold"
                onClick={() => {
                  setPreview("");
                  setImageFile(null);
                }}
              >
                Remove
              </button>
            </div>
          )}
        </div>

     
        <div className="p-4 bg-white flex items-center gap-3 shadow-lg">

      
          <label className="cursor-pointer bg-gray-200 hover:bg-gray-300 p-2 rounded-full">
            <input type="file" accept="image/*" onChange={onFileSelect} className="hidden" />
            📎
          </label>

       
          <input
            value={text}
            onChange={(e) => {
              const v = e.target.value;
              setText(v);
              socket.emit(v.trim() ? "typing" : "stopTyping");
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            placeholder="Type a message..."
            className="flex-1 border px-4 py-2 rounded-full shadow-sm focus:outline-blue-500"
          />

          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700"
          >
            Send
          </button>
        </div>

      </div>
    </div>
  );
}
