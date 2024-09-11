const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

app.use("/", express.static(__dirname + "/htdocs"));

const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/movies", function (request, response) {
	findAllMovies().then(function (listOfMovies) {
		response.header("Content-Type", "application/csv");
		response.send(listOfMovies);
	});
});

//localhost:8000/movie/66e03b4dd71af1b55eab8e79
app.get("/movie/:id", function (request, response) {
	findAMovie(request.params.id).then(function (movieToFind) {
		response.header("Content-Type", "application/csv");
		response.send(movieToFind);
	});
});

async function findAllMovies() {
	await mongoClient.connect();
	const moviesDataBase = mongoClient.db("IMDB");
	const moviesCollection = moviesDataBase.collection("Movies");
	const movies = await moviesCollection.find().toArray();
	return movies;
}

async function findAMovie(movieToFInd) {
	await mongoClient.connect();
	const moviesDataBase = mongoClient.db("IMDB");
	const moviesCollection = moviesDataBase.collection("Movies");
	const query = { _id: new ObjectId(movieToFInd) };
	const movie = await moviesCollection.find(query).toArray();
	return movie;
}
