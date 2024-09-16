const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;
const { ObjectId } = require("mongodb");

app.use("/", express.static(__dirname + "/htdocs"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const url = "mongodb://127.0.0.1:27017/";
const mongoClient = new MongoClient(url);

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/movies", function (request, response) {
	findAllMovies().then(function (listOfMovies) {
		response.header("Content-Type", "application/json");
		response.send(listOfMovies);
	});
});

//localhost:8000/movie/66e03b4dd71af1b55eab8e79
app.get("/movie/:id", function (request, response) {
	findAMovie(request.params.id).then(function (movieToFind) {
		response.header("Content-Type", "application/json");
		response.send(movieToFind);
	});
});

app.delete("/movie/:id", function (request, response) {
	deleteAMovie(request.params.id).then(function () {
		response.header("Content-Type", "application/json");
		response.send("Object deleted");
	});
});

app.post("/movies", function (request, response) {
	createMovie(request.body).then(function () {
		response.header("Content-Type", "application/json");
		response.redirect("./");
	});
});

app.put("/movies/:id", function (request, response) {
	updateMovie(request.params.id, request.body).then(function () {
		response.header("Content-Type", "application/json");
	});
});

async function updateMovie(id, updatedMovie) {
	await mongoClient.connect();
	const moviesDataBase = mongoClient.db("IMDB");
	const moviesCollection = moviesDataBase.collection("Movies");
	const filter = { _id: new ObjectId(id) };
	const option = { upsert: true };
	const updatedDocument = { $set: updatedMovie };
	const result = await moviesCollection.updateOne(
		filter,
		updatedDocument,
		option
	);
}

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

async function deleteAMovie(movieToFInd) {
	await mongoClient.connect();
	const moviesDataBase = mongoClient.db("IMDB");
	const moviesCollection = moviesDataBase.collection("Movies");
	const query = { _id: new ObjectId(movieToFInd) };
	const movie = await moviesCollection.deleteOne(query);
	return;
}

async function createMovie(body) {
	let newMovie = {
		Poster_Link: body.movieImg,
		Series_Title: capitalise(body.name),
		Released_Year: parseInt(body.year),
		Certificate: capitalise(body.certificate),
		Runtime: `${body.time} min`,
		Genre: capitalise(body.type),
		IMDB_Rating: parseFloat(body.imdbScore),
		Overview: capitalise(body.resume),
		Meta_Score: parseInt(body.metaScore),
		Director: capitalise(body.director),
		Star1: capitalise(body.star1),
		Star2: capitalise(body.star2),
		Star3: capitalise(body.star3),
		Star4: capitalise(body.star4),
		No_of_Votes: parseInt(body.nbVotes),
		Gross: body.income,
	};
	try {
		await mongoClient.connect();
		const moviesDataBase = mongoClient.db("IMDB");
		const moviesCollection = moviesDataBase.collection("Movies");
		const result = await moviesCollection.insertOne(newMovie);
	} catch (error) {
		console.error(error);
	}
}

function capitalise(string) {
	return string.replace(/\b\w/g, (char) => char.toUpperCase());
}
