const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const idMovie = urlParams.get("id");

fetch("http://localhost:8000/movie/" + idMovie)
	.then(function (response) {
		return response.json();
	})
	.then(function (movie) {
		diplayMovieDetail(movie[0]);
	})
	.catch(function (err) {
		console.log(err);
	});

function diplayMovieDetail(movie) {
	let elements = document.getElementById("updateForm").elements;
	for (let i = 0, element; (element = elements[i++]); ) {
		if (element.type === "text") {
			element.value = movie[element.name];
		}
	}
}

const updateForm = document.getElementById("updateForm");

updateForm.addEventListener("submit", clickUpdateBtn);

async function clickUpdateBtn(event) {
	event.preventDefault();
	let url = "http://localhost:8000/movies/" + idMovie;
	const form = event.currentTarget;
	try {
		const formData = new FormData(form);
		const responseData = await putFormDataAsJson({ url, formData });
	} catch (error) {
		console.log(error);
	}
}

async function putFormDataAsJson({ url, formData }) {
	const plainFormData = Object.fromEntries(formData.entries());
	console.log(plainFormData);

	const formDataJsonString = JSON.stringify(plainFormData);

	const fetchOptions = {
		method: "PUT",
		headers: {
			"Content-Type": "application/json",
			Accept: "application/json",
		},
		body: formDataJsonString,
	};

	const response = await fetch(url, fetchOptions);
	if (!response.ok) {
		const errorMessage = await response.text();
		throw new Error(errorMessage);
	}
	return response.json;
}
