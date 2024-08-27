// protocole http

// let http = require("http");

// let request = {
// 	host: "www.google.be",
// 	port: 80,
// 	path: "/",
// };

// http.get(request, receiveResponseCallback);

// function receiveResponseCallback(response) {
// 	let rawData = "";
// 	console.log("got response " + response.statusCode);
// 	response.on("data", (chunk) => {
// 		rawData += chunk;
// 		// concatener le rowdata et les infos du chunk : rawData += chunk
// 	});
// 	response.on("end", function (chunk) {
// 		console.log(rawData);
// 	});
// }

// protocole https

let https = require("https");

let requestHttps = {
	host: "interface3.be",
	port: 443,
	path: "/fr",
};

https.get(requestHttps, receiveResponse);

function receiveResponse(response) {
	let rawData = "";
	console.log("got response " + response.statusCode);
	response.on("data", (chunk) => {
		rawData += chunk;
	});
	response.on("end", function (chunk) {
		console.log(rawData);
	});
}
