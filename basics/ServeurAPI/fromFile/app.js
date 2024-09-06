const fileStream = require("fs");
const express = require("express");
const app = express();

const zipcodes = fileStream.readFileSync("./zipcode-belgium.json");
const zipcodesJSON = JSON.parse(zipcodes);

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

	let i = 0;

	let paramRequest = request.query.city;

	// while (
	// 	i < zipcodesJSON.zipCodes.length &&
	// 	zipcodesJSON.zipCodes[i].city != paramRequest
	// ) {
	// 	i++;
	// }
	let index = zipcodesJSON.zipCodes.map((e) => e.city).indexOf(paramRequest);

	let responseZipJSON = {};

	if (index != -1) {
		responseZipJSON = {
			city: zipcodesJSON.zipCodes[index].city,
			zip: zipcodesJSON.zipCodes[index].zip,
		};
	}

	response.send(responseZipJSON);
});
