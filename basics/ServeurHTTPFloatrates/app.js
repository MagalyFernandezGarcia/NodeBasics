const express = require("express");
const app = express();
app.set("view engine", "ejs");
const fileStream = require("fs");
app.use("/", express.static(__dirname + "/htdocs"));

let fileContent = fileStream.readFileSync("./cache/currenciesList.json");

let floatrates = JSON.parse(fileContent);
app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/", function (request, response) {
	response.render("template.ejs", { currencies: floatrates.currenciesArray });
});
