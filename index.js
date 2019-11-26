require("dotenv").config();
const { logger, errorlogger } = require("./logger");
const path = require("path");
const process = require("process");
const express = require("express");
const cookieParser = require("cookie-parser");
const compression = require('compression');

const app = express();
const http = require("http").Server(app);
const io = require("socket.io")(http);
const MemDB = require("./models/db");

const PORT = process.env.PORT || 8000;
const APPURL = process.env.APP_URL;
const ENV = process.env.NODE_ENV || "dev";

/* initialize server */
app.use(logger(ENV));
app.use(errorlogger(ENV));
app.use(compression())
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.disable("x-powered-by");
const memDb = new MemDB(io);

/* serve webapp from "/" or "/index.html" */
app.use("/", express.static(path.join(__dirname, "app/build")));

/* set up (very) basic JSON api */
app.use("/users", (req, res) => {
  /* console.log("[json api]", { users: memDb.store.users }); */
  res.status(200).json({
    users: memDb.store.users
  });
});

app.use("/user/:id", (req, res) => {
  const { id } = req.params;
  const user = memDb.getUser(id);

  if (user) {
    res.status(200).json({ id, user });
  } else {
    res.status(404).send({ id, error: "no user by that id!" });
  }
});

io.on("connection", socket => {
  socket.on("user-connected", data => {
    memDb.addUser(data);
    memDb.updateConnections();

    console.log("user-connected!");
    io.emit("user-connected", { ...data, users: memDb.get("connections") });
  });
  socket.on("question", data => {
    console.log("[question from]: " + data.user, data.question);
    memDb.addQuestion(data);
    io.emit("question", data);
  });
  socket.on("disconnect", data => {
    memDb.updateConnections();
    io.emit("user-update", { users: memDb.get("connections") });
  });
});

http.listen(PORT, () => {
  console.log(__filename + " listening on *:" + PORT);
});
