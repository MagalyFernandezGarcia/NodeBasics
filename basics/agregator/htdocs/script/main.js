const dateAndTime = document.getElementById("dateAndTime");

const dateFull = new Date();

const date = dateFull.toLocaleDateString("fr-FR");
const hour = dateFull.toLocaleTimeString("fr-FR").slice(0, 5);

dateAndTime.innerText = `${date} ${hour}`;
