const https = require("https");
const fileStream = require("fs");
const parseString = require("xml2js").parseString;

refreshRSSLeMonde();
setInterval(refreshRSSLeMonde, 30 * 60 * 1000); //toutes les demi-heures

function refreshRSSLeMonde() {
	const request = {
		host: "www.lemonde.fr",
		port: 443,
		path: "/cinema/rss_full.xml",
	};

	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";
		console.log("got response " + response.statusCode);
		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			const filmItems = { items: [] };
			parseString(rawData, function (err, result) {
				const channel = result.rss.channel[0];

				for (let i = 0; i < channel.item.length; i++) {
					// console.log(channel.item[i].title[0]);

					filmItems.items.push({
						title: channel.item[i].title[0],
						pubDate: channel.item[i].pubDate[0],
						description: channel.item[i].description[0],
						link: channel.item[i].link[0],
						imageURL: channel.item[i]["media:content"][0].$.url,
					});
				}
				console.log(filmItems);
				fileStream.writeFile(
					"./cache/filmsList.json",
					JSON.stringify(filmItems, null, "\t"),
					function (err) {
						if (err) console.log(err);
						else console.log("file saved");
					}
				);
			});
		});
	}
}
