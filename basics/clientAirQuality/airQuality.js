const https = require("https");
const fileStream = require("fs");

const request = {
	host: "air-quality-api.open-meteo.com",
	port: 443,
	path: "/v1/air-quality?latitude=52.5235&longitude=13.4115&hourly=pm10,pm2_5",
};

refreshQuality();
setInterval(refreshQuality, 60 * 60 * 1000); //toutes les heures

function refreshQuality() {
	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";
		console.log("got response " + response.statusCode);
		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			// console.log(rawData);
			const airQuality = JSON.parse(rawData);
			const sexyairQuality = { forecast: [] };

			for (let i = 0; i < airQuality.hourly.time.length; i++) {
				sexyairQuality.forecast.push({
					time: airQuality.hourly.time[i],
					qualityPm10: airQuality.hourly.pm10[i],
					qualityPm2_5: airQuality.hourly.pm2_5[i],
				});
			}

			console.log(sexyairQuality);

			fileStream.writeFile(
				"./cache/WeatherForecast.json",
				JSON.stringify(sexyairQuality, null, "\t"),
				function (err) {
					if (err) console.log(err);
					else console.log("file saved");
				}
			);
		});
	}
}
