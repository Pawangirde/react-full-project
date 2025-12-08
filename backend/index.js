// require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");

const DB_URI =
  "mongodb+srv://pawangirde01:Pawan%4001@test.wbcekcv.mongodb.net/DigitalBuzzTASK2";

const messagesRoute = require("./routes/messages");

const app = express();
const PORT =4000;

app.use(cors());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "assets", "images")));

app.use("/messages", messagesRoute);

const URI = DB_URI;

mongoose
  .connect(URI)
  .then(() => console.log("Mongoose Connected!"))
  .catch((err) => console.log("DB Error:", err));

app.listen(PORT, () => {
  console.log(`Server is running on Port ${PORT}`);
});
