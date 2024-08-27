const express = require("express");
const app = express();
app.set("view engine", "ejs");
const fileStream = require("fs");
app.use("/", express.static(__dirname + "/htdocs"));

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});
