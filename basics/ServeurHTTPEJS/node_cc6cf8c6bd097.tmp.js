const express = require("express");
const app = express();
app.set("view engine", "ejs");

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/", function (request, response) {
	response.render("template.ejs", { nom: "Rudi" });
});
