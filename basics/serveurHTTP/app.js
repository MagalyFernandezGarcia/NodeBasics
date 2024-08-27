const express = require("express");
const app = express();

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
	console.log(__dirname);
});

app.get("/", function (request, response) {
	response.setHeader("content-Type", "text/html");
	// response.send("<strong>Hello World</strong>");
	response.sendFile(__dirname + "/htdocs/index.html");
});
