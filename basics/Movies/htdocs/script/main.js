const listOfMovies = document.querySelector(".listMovie");
const movieCard = document.querySelector(".movieContent");
const movieCardInfo = document.querySelector(".info");
const CRUDBtn = document.querySelector(".buttons");
const modal = document.querySelector(".modal");
const add = document.getElementById("addBtn");

fetch("http://localhost:8000/movies")
	.then(function (response) {
		return response.json();
	})
	.then(function (movies) {
		addList(movies);
	})
	.catch(function (err) {
		console.log(err);
	});

function addList(arrayofMovies) {
	arrayofMovies.forEach((movie) => {
		const title = document.createElement("p");
		title.innerText = movie.Series_Title;
		listOfMovies.append(title);

		title.addEventListener("click", () => {
			fetch("http://localhost:8000/movie/" + movie._id)
				.then(function (response) {
					return response.json();
				})
				.then(function (movie) {
					movieID(movie);
				})
				.catch(function (err) {
					console.log(err);
				});
		});
	});
}

function movieID(selectedMovie) {
	console.log(selectedMovie);
	movieCard.innerHTML = "";
	movieCardInfo.innerHTML = "";
	CRUDBtn.innerHTML = "";
	const img = document.createElement("img");
	img.src = selectedMovie.Poster_Link;
	img.className = "moviePoster";

	const style = document.createElement("p");
	const year = document.createElement("p");
	const duration = document.createElement("p");
	duration.innerText = selectedMovie.Runtime;
	year.innerText = selectedMovie.Released_Year;
	style.innerText = selectedMovie.Genre;
	movieCardInfo.append(img, year, duration, style);

	const titleMovie = document.createElement("h2");
	titleMovie.innerText = selectedMovie.Series_Title;
	titleMovie.className = "title";

	const director = document.createElement("p");
	const actors = document.createElement("p");
	const resume = document.createElement("p");
	const IMDBScore = document.createElement("p");
	const nbrOfVotes = document.createElement("p");
	const income = document.createElement("p");
	director.innerText = `Directeur: ${selectedMovie.Director}`;
	actors.innerText = `Acteurs: ${selectedMovie.Star1}, ${selectedMovie.Star2}, ${selectedMovie.Star3}`;
	resume.innerText = `Résumé: ${selectedMovie.Overview}`;
	resume.className = "resume";
	IMDBScore.innerText = `Score IMDB: ${selectedMovie.IMDB_Rating}`;
	nbrOfVotes.innerText = `Nombre de votes: ${selectedMovie.No_of_Votes}`;

	if (selectedMovie.Gross === undefined) {
		income.innerText = ``;
	} else {
		const currencyIncome = selectedMovie.Gross.toLocaleString("en-US", {
			style: "currency",
			currency: "USD",
		});

		income.innerText = `Bénéfice: $${currencyIncome}`;
	}

	const deleteBtn = document.createElement("img");
	const addBtn = document.createElement("img");
	const updateBtn = document.createElement("img");
	deleteBtn.src = "./images/trash-solid.svg";
	deleteBtn.className = "icon";
	addBtn.src = "./images/plus-solid.svg";
	addBtn.className = "icon";
	updateBtn.src = "./images/pen-solid.svg";
	updateBtn.className = "icon";

	CRUDBtn.append(deleteBtn, addBtn, updateBtn);
	deleteMovie(deleteBtn, selectedMovie._id);
	addMovie(addBtn);
	editMovie(updateBtn, selectedMovie._id);

	movieCard.append(
		titleMovie,
		movieCardInfo,
		director,
		actors,
		resume,
		IMDBScore,
		nbrOfVotes,
		income,
		CRUDBtn
	);
}

add.addEventListener("click", () => {
	window.location.replace("./create.html");
});

function addMovie(btn) {
	btn.addEventListener("click", () => {
		window.location.replace("./create.html");
	});
}

function deleteMovie(btn, movieId) {
	btn.addEventListener("click", (event) => {
		const modalBtn = document.querySelectorAll(".modalBtn");
		modal.style.display = "block";

		modalBtn[0].addEventListener("click", () => {
			console.log("delete");

			fetch("http://localhost:8000/movie/" + movieId, {
				method: "DELETE",
			})
				.then(function (response) {
					location.reload();
				})
				.catch(function (err) {
					console.log(err);
				});
		});

		modalBtn[1].addEventListener("click", () => {
			console.log("annulé");

			modal.style.display = "none";
		});
	});
}

function editMovie(btn, movieID) {
	btn.addEventListener("click", () => {
		window.location = "./update.html?id=" + movieID;
	});
}
