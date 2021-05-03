require("dotenv").config({ path: "./config.env" });
const app = require("./index");
const mongoose = require("mongoose");

// Establishing database connection
mongoose
	.connect(process.env.MONGODB_URI, {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(() => console.log("DB connection successful!"))
	.catch(() => console.log("Error connecting DB!"));

app.listen(9000, () => console.log("server is runnning at port 9000!"));
