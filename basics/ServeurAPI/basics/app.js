const express = require("express");
const app = express();

app.listen(8000, function () {
	console.log("Server is running and listening on port 8000");
});

app.get("/date", function (request, response) {
	const today = new Date();
	const daysOfWeek = [
		"Dimanche",
		"Lundi",
		"Mardi",
		"Mercredi",
		"Jeudi",
		"Vendredi",
		"Samedi",
	];

	const dateAndHour = {
		todayDate: today.toLocaleDateString("fr-BE"),
		nowTime: today.toLocaleTimeString("fr-BE"),
		day: daysOfWeek[today.getDay()] + " " + today.getDate(),
		month: today.getMonth() + 1,
		year: today.getFullYear(),
		hour: today.getHours(),
		minute: today.getMinutes(),
		second: today.getSeconds(),
	};
	response.setHeader("Content-Type", "application/json");
	response.send(dateAndHour);
});
