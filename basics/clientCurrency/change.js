const https = require("https");
const fileStream = require("fs");

const request = {
	host: "www.floatrates.com",
	port: 443,
	path: "/daily/eur.json",
};

refreshCurrency();
setInterval(refreshCurrency, 60 * 60 * 1000); //toutes les heures

function refreshCurrency() {
	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";
		console.log("got response " + response.statusCode);
		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			// console.log(rawData);
			const currencies = JSON.parse(rawData);
			const currenciesJSON = {
				currenciesArray: [],
			};

			for (let key in currencies) {
				currenciesJSON.currenciesArray.push({
					name: currencies[key].name,
					value: currencies[key].rate,
					code: currencies[key].code,
				});
			}

			fileStream.writeFile(
				"./cache/currenciesList.json",
				JSON.stringify(currenciesJSON, null, "\t"),
				function (err) {
					if (err) console.log(err);
					else console.log("file saved");
				}
			);
		});
	}
}
