// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const http = require("http");
const { Server } = require("socket.io");
const DB_URI =
  "mongodb+srv://pawangirde01:Pawan%4001@test.wbcekcv.mongodb.net/DigitalBuzzTASK2";

const askRoute = require("./routes/ask");
const messagesRoute = require("./routes/messages");
const uploadRoutes = require("./routes/upload");
const botRoute = require("./routes/bot");

const ChatMessage = require("./models/ChatMessage");
const chatRoute = require("./routes/chat");
const uploadsRoute = require("./routes/uploads");

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "assets", "images")));

app.use("/chat", chatRoute);
app.use("/uploads", uploadsRoute);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", askRoute);

app.use("/messages", messagesRoute);
app.use("/upload", uploadRoutes);
app.use("/bot", botRoute);

const URI = DB_URI;

mongoose
  .connect(URI)
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log("DB Error:", err));

// Create HTTP + Socket server
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

let onlineUsers = {};

// io.on("connection", (socket) => {
//   console.log("User connected", socket.id);

//   socket.on("join", (username) => {
//     socket.username = username;
//     onlineUsers[socket.id] = username;
//     io.emit("onlineUsers", Object.values(onlineUsers));
//   });

//   socket.on("sendMessage", async (msg) => {
//     const saved = await ChatMessage.create(msg);
//     io.emit("newMessage", saved);
//   });

//   socket.on("typing", () => {
//     socket.broadcast.emit("typing", socket.username);
//   });

//   socket.on("stopTyping", () => {
//     socket.broadcast.emit("stopTyping");
//   });

//   socket.on("disconnect", () => {
//     delete onlineUsers[socket.id];
//     io.emit("onlineUsers", Object.values(onlineUsers));
//   });
// });

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  // JOIN CHAT
  socket.on("join", async (username) => {
    socket.username = username;
    onlineUsers[socket.id] = username;

    io.emit("onlineUsers", Object.values(onlineUsers));

    
    const joinMsg = await ChatMessage.create({
      sender: "system",
      text: `${username} joined the chat`,
      image: null,
    });

    io.emit("newMessage", joinMsg);
  });


  socket.on("sendMessage", async (msg) => {
    const saved = await ChatMessage.create(msg);
    io.emit("newMessage", saved);
  });

 
  socket.on("typing", () => {
    socket.broadcast.emit("typing", socket.username);
  });

  socket.on("stopTyping", () => {
    socket.broadcast.emit("stopTyping");
  });


  socket.on("disconnect", async () => {
    const username = onlineUsers[socket.id];
    delete onlineUsers[socket.id];
    io.emit("onlineUsers", Object.values(onlineUsers));

    if (username) {
      const leaveMsg = await ChatMessage.create({
        sender: "system",
        text: `${username} left the chat`,
        image: null,
      });

      io.emit("newMessage", leaveMsg);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
