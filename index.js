const path = require('path')
const express = require('express');
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const dotenv = require('dotenv').config;
const MemDB = require('./models/db');

const port = process.env.PORT || 8000;
const appUrl = process.env.APP_URL;

app.use('/', express.static(path.join(__dirname, 'app/build')))


let memDb = new MemDB(io);
io.on("connection", socket => {

  socket.on("user-connected", data => {
    memDb.addUser(data);
    memDb.updateConnections();

    console.log("user-connected:", data);
    io.emit("user-connected", { ...data, users: memDb.get('connections') });
  });
  socket.on("question", msg => {
    console.log("[question from]: " + socket.address, msg);
    io.emit("question", msg);
  });
  socket.on("disconnect", data => {
    memDb.updateConnections();
    io.emit("user-update", { users: memDb.get('connections') });
  });
});

http.listen(port, () => {
  console.log("listening on *:" + port);
});
