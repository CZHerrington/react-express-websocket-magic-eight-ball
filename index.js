require("dotenv").config();
const { logger, errorlogger } = require("./logger");
const path = require("path");
const process = require("process");
const express = require("express");
const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const axios = require('axios');
const cookieParser = require("cookie-parser");
const compression = require('compression');
const helmet = require('helmet');
const MemDB = require("./models/db");

const PORT = process.env.PORT || 8000;
const APPURL = process.env.APP_URL;
const ENV = process.env.NODE_ENV || "dev";

/* initialize server */
app.use(logger(ENV));
app.use(errorlogger(ENV));
app.use(compression());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable("x-powered-by");
const db = new MemDB(io);

/* serve webapp from "/" or "/index.html" */
app.use("/", express.static(path.join(__dirname, "app/build")));

/* set up (very) basic JSON api */
app.use("/users", (req, res) => {
  /* console.log("[json api]", { users: db.store.users }); */
  res.status(200).json({
    users: db.store.users
  });
});

app.use("/user/:id", (req, res) => {
  const { id } = req.params;
  const user = db.getUser(id);

  if (user) {
    res.status(200).json({ id, user });
  } else {
    res.status(404).send({ id, error: "no user by that id!" });
  }
});

/* handle 404 errors */
app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, "/pages/404.html"));
})

/* handle websocket connections */
io.on("connection", socket => {
  socket.on("user:connected", data => {
    db.addUser(data);
    db.updateConnections();

    console.log("user:connected!");
    io.emit("user:connected", { ...data, users: db.get("connections") });
  });
  socket.on("question", data => {
    console.log("[question from]: " + data.user, data.question);
    db.addQuestion(data);
    io.emit("question", data);
  });
  socket.on("disconnect", data => {
    db.updateConnections();
    io.emit("user:update", { users: db.get("connections") });
  });
});

http.listen(PORT, () => {
  console.log(__filename + " listening on *:" + PORT);
});
