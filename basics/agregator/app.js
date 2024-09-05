const express = require("express");
const app = express();
const https = require("https");
const fileStream = require("fs");
const parseString = require("xml2js").parseString;
require("dotenv").config();

let megaJSON = new Object();

app.set("view engine", "ejs");
app.use("/", express.static(__dirname + "/htdocs"));

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/", function (request, response) {
	response.render("template.ejs", megaJSON);
});

refreshWeather();
setInterval(refreshWeather, 60 * 60 * 1000);
refreshRSSLeMonde();
setInterval(refreshRSSLeMonde, 30 * 60 * 1000);
refreshRail();
setInterval(refreshRail, 60 * 1000);
refreshRSSJV();
setInterval(refreshRSSJV, 30 * 60 * 1000);

function refreshWeather() {
	const request = {
		host: "api.open-meteo.com",
		port: 443,
		path: "/v1/forecast?latitude=50.85&longitude=4.35&hourly=temperature_2m",
	};

	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";

		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			const weather = JSON.parse(rawData);
			const sexyWeather = { forecast: [] };

			for (let i = 0; i < weather.hourly.time.length; i++) {
				sexyWeather.forecast.push({
					time: weather.hourly.time[i],
					temperature: weather.hourly.temperature_2m[i],
				});
			}

			fileStream.writeFile(
				"./cache/weatherForecast.json",
				JSON.stringify(sexyWeather, null, "\t"),
				function (err) {
					if (err) console.log(err);
					else console.log("file saved");
				}
			);

			megaJSON.weather = sexyWeather;
		});
	}
}

function refreshRSSLeMonde() {
	const request = {
		host: "www.lemonde.fr",
		port: 443,
		path: "/cinema/rss_full.xml",
	};

	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";

		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			const filmItems = { items: [] };
			parseString(rawData, function (err, result) {
				const channel = result.rss.channel[0];

				for (let i = 0; i < channel.item.length; i++) {
					filmItems.items.push({
						title: channel.item[i].title[0],
						pubDate: channel.item[i].pubDate[0],
						description: channel.item[i].description[0],
						link: channel.item[i].link[0],
						imageURL: channel.item[i]["media:content"][0].$.url,
					});
				}

				fileStream.writeFile(
					"./cache/filmsList.json",
					JSON.stringify(filmItems, null, "\t"),
					function (err) {
						if (err) console.log(err);
						else console.log("file saved");
					}
				);

				megaJSON.films = filmItems;
			});
		});
	}
}

function refreshRail() {
	const request = {
		host: "api.irail.be",
		port: 443,
		path: "/v1/liveboard/?id=BE.NMBS.008812005&lang=fr&format=json",
	};

	https.get(request, receiveResponseCallback);

	function receiveResponseCallback(response) {
		let rawData = "";
		console.log("got response " + response.statusCode);
		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			const infoTrain = JSON.parse(rawData);

			const liveboard = { items: [] };

			for (let i = 0; i < infoTrain.departures.departure.length; i++) {
				let firstDeparture = infoTrain.departures.departure[i];
				let timeDeparture = new Date(parseInt(firstDeparture.time) * 1000);
				timeDeparture = timeDeparture.toLocaleTimeString("Fr-fr");
				let delay = firstDeparture.delay / 60;

				liveboard.items.push({
					station: firstDeparture.station,
					hour: timeDeparture,
					plateform: firstDeparture.platform,
					delay: delay,
				});
			}
			fileStream.writeFile(
				"./cache/liveboard.json",
				JSON.stringify(liveboard, null, "\t"),
				function (err) {
					if (err) console.log(err);
					else console.log("file saved");
				}
			);

			megaJSON.train = liveboard;
		});
	}
}

function refreshRSSJV() {
	const request = {
		host: "www.jeuxvideo.com",
		port: 443,
		path: "/rss/rss.xml",
	};

	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";

		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			const gameItems = { items: [] };
			parseString(rawData, function (err, result) {
				const channel = result.rss.channel[0];

				for (let i = 0; i < channel.item.length; i++) {
					gameItems.items.push({
						category: channel.item[i].category,
						title: channel.item[i].title[0],
						pubDate: channel.item[i].pubDate[0],
						description: channel.item[i].description[0],
						link: channel.item[i].link[0],
						imageURL: channel.item[i].enclosure[0].$.url,
					});
				}

				fileStream.writeFile(
					"./cache/gameNews.json",
					JSON.stringify(gameItems, null, "\t"),
					function (err) {
						if (err) console.log(err);
						else console.log("file saved");
					}
				);

				megaJSON.games = gameItems;
			});
		});
	}
}

refreshWeatherIcon();

function refreshWeatherIcon() {
	const request = {
		host: "api.openweathermap.org",
		port: 443,
		path: `/data/2.5/weather?q=brussel&appid=${process.env.APITOKEN}`,
	};

	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";

		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			const infoWeather = JSON.parse(rawData);

			const iconWeather = { icon: infoWeather.weather[0].icon };

			const urlIcon = `https://openweathermap.org/img/wn/${iconWeather.icon}.png`;

			fileStream.writeFile(
				"./cache/icon.json",
				JSON.stringify(iconWeather, null, "\t"),
				function (err) {
					if (err) console.log(err);
					else console.log("file saved");
				}
			);

			megaJSON.iconWeather = urlIcon;
		});
	}
}
