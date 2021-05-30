const express = require("express");
const cors = require("cors");
const expressfileupload = require("express-fileupload");

const app = express();

const userRouter = require("./routes/userRoutes");

app.use(cors(), express.json(), expressfileupload());

app.get("/", (req, res) =>
	res.json({ success: true, message: "server is running!" })
);

app.use("/api/users", userRouter);

module.exports = app;
