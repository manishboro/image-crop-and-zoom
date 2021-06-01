const express = require("express");
const cors = require("cors");

const app = express();

const userRouter = require("./routes/userRoutes");

app.use(cors(), express.json());

app.get("/", (req, res) =>
  res.json({ success: true, message: "server is running!" })
);

app.use("/api/users", userRouter);

module.exports = app;
