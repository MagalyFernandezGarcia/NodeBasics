const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

let zipCode;
let zipCodes;
// connectDB();
findAllZipCodes();

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/zipcodes", function (request, response) {
	response.setHeader("Content-Type", "application/json");
	response.send(zipCodes);
});

// http://localhost:8000/zipcode?city=Ixelles
app.get("/zipcode", function (request, response) {
	findZipFrom(request.query.city).then(function (zipResult) {
		response.setHeader("Content-Type", "application/json");
		response.send(zipResult);
	});
});

// http://localhost:8000/zip/1050
app.get("/zip/:cp", function (request, response) {
	findCityFrom(request.params.cp).then(function (cityResult) {
		response.setHeader("Content-Type", "application/json");

		response.send(cityResult);
	});
});

// http://localhost:8000/city/66db079030459a3759ad8416
app.get("/city/:id", function (request, response) {
	findCityFromId(request.params.id).then(function (cityResult) {
		response.setHeader("Content-Type", "application/json");

		response.send(cityResult);
	});
});

// async function connectDB() {
// 	try {
// 		await mongoClient.connect();
// 		console.log("You successfully connected to DB");
// 		const adressesDatabase = mongoClient.db("address"); //se connecter à la base de donnée address
// 		const zipCodesCollection = adressesDatabase.collection("zipcode"); //aller chercher la collection zipcode
// 		const options = {
// 			projection: { city: 1, zip: 1, _id: 0 },
// 		}; // projection : si on ne veut pas voir :0 si on veut voir en particulier:1, à utiliser lorsqu'on fait le find

// 		zipCode = await zipCodesCollection.findOne(); //chercher une data au hasard dans la collection
// 		zipCodes = await zipCodesCollection.find().toArray(); //transformer en tableaux toutes les données.{} en premier dans les () =query puis mettre les options de projection
// 	} catch (error) {
// 		console.error(error);
// 	}
// }

async function findZipFrom(cityToFind) {
	try {
		await mongoClient.connect();
		const adressesDatabase = mongoClient.db("address");
		const zipCodesCollection = adressesDatabase.collection("zipcode");
		const options = {
			projection: { city: 1, zip: 1, _id: 0 },
		};

		const query = { city: cityToFind };
		const result = await zipCodesCollection.find(query, options).toArray();
		return result[0];
	} catch (error) {
		console.error(error);
	}
}

async function findAllZipCodes() {
	try {
		await mongoClient.connect();
		const adressesDatabase = mongoClient.db("address");
		const zipCodesCollection = adressesDatabase.collection("zipcode");
		const options = {
			projection: { _id: 0 },
		};

		zipCodes = await zipCodesCollection.find({}, options).toArray();
	} catch (error) {
		console.error(error);
	}
}

async function findCityFrom(zipToFind) {
	try {
		await mongoClient.connect();
		const adressesDatabase = mongoClient.db("address");
		const zipCodesCollection = adressesDatabase.collection("zipcode");
		const options = {
			projection: { city: 1, zip: 1, _id: 0 },
		};

		const query = { zip: zipToFind };
		const result = await zipCodesCollection.find(query, options).toArray();

		return result[0];
	} catch (error) {
		console.error(error);
	}
}

async function findCityFromId(idToFind) {
	try {
		await mongoClient.connect();
		const adressesDatabase = mongoClient.db("address");
		const zipCodesCollection = adressesDatabase.collection("zipcode");
		const options = {
			projection: { city: 1, zip: 1, _id: 1 },
		};
		const query = { _id: new ObjectId(idToFind) };

		const result = await zipCodesCollection.find(query, options).toArray();

		return result[0];
	} catch (error) {
		console.error(error);
	}
}
