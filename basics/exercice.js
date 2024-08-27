const date = new Date();
const day = date.getDate();
const month = date.getMonth() + 1;
const year = date.getFullYear();
const hour = date.getHours();
const minit = date.getMinutes();

console.log(
	"nous sommes le " +
		day +
		"/" +
		month +
		"/" +
		year +
		" et il est " +
		hour +
		":" +
		minit
);

// calculer le nombre de jour qui sépare 2 dates
const ancienneDate = new Date(1995, 7, 28);
const aujourdhui = new Date();
const nbrMilliSec = aujourdhui - ancienneDate;
const nbrJours = nbrMilliSec / (1000 * 60 * 60 * 24);

console.log(Math.floor(nbrJours));

// crééer un objet js

const animal = {
	name: "chat",
	numberOfLegs: 4,
	typeOfSkin: "fourrure",
	sound: "miaou",
	housePet: true,
};

let maVoiture = new Object();
maVoiture.fabricant = "Ford";
maVoiture.modele = "Mustang";
maVoiture.annee = 1969;

function Voiture(fabricant, modele, annee) {
	this.fabricant = fabricant;
	this.modele = modele;
	this.annee = annee;
}

let saVoiture = new Voiture("Mazda", "Miata", 1993);

console.log("le " + animal.name + " fait " + animal.sound);

// créer un décompteur de 10 à 0

let number = 11;
function countDown() {
	number--;
	if (number > 0) {
		setTimeout(countDown, 1000);
	}
	console.log(number);
}

countDown();
