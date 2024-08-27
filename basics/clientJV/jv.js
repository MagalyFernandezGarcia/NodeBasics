const https = require("https");
const fileStream = require("fs");
const parseString = require("xml2js").parseString;

refreshRSSJV();
setInterval(refreshRSSJV, 30 * 60 * 1000); //toutes les demi-heures

function refreshRSSJV() {
	const request = {
		host: "www.jeuxvideo.com",
		port: 443,
		path: "/rss/rss.xml",
	};

	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";
		console.log("got response " + response.statusCode);
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
			});
		});
	}
}
