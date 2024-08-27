const express = require("express");
const app = express();
app.set("view engine", "ejs");

let voitures = [
	{ fabricant: "Fiat", modele: "500", annee: 2022 },
	{ fabricant: "Ford", modele: "Fiesta", annee: 2011 },
	{ fabricant: "Mercedes", modele: "C", annee: 2015 },
];

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/", function (request, response) {
	response.render("template.ejs", { cars: voitures });
});
