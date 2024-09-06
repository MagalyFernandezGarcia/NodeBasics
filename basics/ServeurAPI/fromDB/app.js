const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/zipcodes", function (request, response) {
	response.setHeader("Content-Type", "application/json");
	response.send(zipcodes);
});

// http://localhost:8000/zipcode?city=Ixelles
app.get("/zipcode", function (request, response) {
	response.setHeader("Content-Type", "application/json");

	let responseZipJSON = {};

	if (i != zipcodesJSON.zipCodes.length) {
		responseZipJSON = {
			city: zipcodesJSON.zipCodes[index].city,
			zip: zipcodesJSON.zipCodes[index].zip,
		};
	}

	response.send(responseZipJSON);
});
