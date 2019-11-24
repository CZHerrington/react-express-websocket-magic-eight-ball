const path = require("path");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const dotenv = require("dotenv").config;
const MemDB = require("./models/db");

const port = process.env.PORT || 8000;
const appUrl = process.env.APP_URL;

// serve webapp from "/" or "/index.html"
app.use("/", express.static(path.join(__dirname, "app/build")));

// set up (very) basic JSON api
app.use("/users", (req, res) => {
  console.log("[json api]", { users: memDb.store.users });
  res.status(200).json({
    users: memDb.store.users
  });
});

app.use("/user/:id", (req, res) => {
  const { id } = req.params;
  console.log("[json api]", { id, data: memDb.users });
  res.status(200).json({
    id,
    users: memDb.store.users
  });
});

let memDb = new MemDB(io);
io.on("connection", socket => {
  socket.on("user-connected", data => {
    memDb.addUser(data);
    memDb.updateConnections();

    console.log("user-connected:", data);
    io.emit("user-connected", { ...data, users: memDb.get("connections") });
  });
  socket.on("question", data => {
    console.log("[question from]: " + data.user, data);
    memDb.addQuestion(data);
    io.emit("question", data);
  });
  socket.on("disconnect", data => {
    memDb.updateConnections();
    io.emit("user-update", { users: memDb.get("connections") });
  });
});

http.listen(port, () => {
  console.log("listening on *:" + port);
});
