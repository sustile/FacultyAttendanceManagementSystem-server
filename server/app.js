const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fs = require("fs");
// const ExpressPeerServer = require("peer").ExpressPeerServer;
const { createServer } = require("http");
// const io = require("./socketConnections");

const { verify, verifyDisable } = require("./middlewares/middleware");
const router = require("./Routers/router");
const { pathToFileURL } = require("url");
const app = express();
const cors = require("cors");

app.use(morgan("common"));
app.disable("etag")
app.use(cookieParser());
app.use(express.json({ limit: 15000000 }));
app.use(express.urlencoded({ extended: false }));
// app.use(cors());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  // res.header(
  //   "Access-Control-Allow-Headers",
  //   "Origin, X-Requested-With, Content-Type, Accept",
  // );
  next();
});


app.use("/", router);

const server = createServer(app);

server.listen(5001, "0.0.0.0", () => {
  console.log("Server Started on Port 5001");
});
