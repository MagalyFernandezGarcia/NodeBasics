const https = require("https");
const fileStream = require("fs");

const request = {
	host: "api.open-meteo.com",
	port: 443,
	path: "/v1/forecast?latitude=50.85&longitude=4.35&hourly=temperature_2m",
};

refreshWeather();
setInterval(refreshWeather, 60 * 60 * 1000); //toutes les heures

function refreshWeather() {
	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";
		console.log("got response " + response.statusCode);
		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			// console.log(rawData);
			const weather = JSON.parse(rawData);
			const sexyWeather = { forecast: [] };

			for (let i = 0; i < weather.hourly.time.length; i++) {
				sexyWeather.forecast.push({
					time: weather.hourly.time[i],
					temperature: weather.hourly.temperature_2m[i],
				});
			}

			console.log(sexyWeather);

			fileStream.writeFile(
				"./cache/WeatherForecast.json",
				JSON.stringify(sexyWeather, null, "\t"),
				function (err) {
					if (err) console.log(err);
					else console.log("file saved");
				}
			);
		});
	}
}
