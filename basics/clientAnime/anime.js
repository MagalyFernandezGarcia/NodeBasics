const https = require("https");
const fileStream = require("fs");
const parseString = require("xml2js").parseString;

refreshRSSNautiljon();
setInterval(refreshRSSNautiljon, 30 * 60 * 1000);
function refreshRSSNautiljon() {
	const request = {
		host: "www.nautiljon.com",
		port: 443,
		path: "/actualite/rss.php",
	};

	https.get(request, receiveResponse);

	function receiveResponse(response) {
		let rawData = "";
		console.log("got response " + response.statusCode);
		response.on("data", (chunk) => {
			rawData += chunk;
		});
		response.on("end", function (chunk) {
			const newsItems = { items: [] };
			parseString(rawData, function (err, result) {
				const channel = result.rss.channel[0];
				console.log(result);
				for (let i = 0; i < channel.item.length; i++) {
					newsItems.items.push({
						title: channel.item[i].title[0],
						pubDate: channel.item[i].pubDate[0],
						description: channel.item[i].description[0],
						link: channel.item[i].link[0],
					});
				}
			});
		});
	}
}
