export const SchoolSubjects = [
	"Mathematik",
	"Informatik",
	"Physik",
	"Chemie",
	"Politik",
	"Wirtschaft",
	"Geschichte",
	"Erdkunde",
	"Biologie",
	"Kunst",
	"Philosophie",
	"Religion",
	"Deutsch",
	"Englisch",
	"Latein",
	"Französisch",
	"Spanisch",
	"Italienisch",
	"Chinesisch",
];

export const SchoolClasses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];

export const Keys = [1, 2, 3, 4, 5];

export const TabMap = new Map([
	[1, "Alles"],
	[2, "In der Warteschlange"],
	[3, "Im Video-Call"],
	[4, "Freigeschaltet"],
	[5, "Abgelehnt"],
]);

export const KeyMap = new Map([
	[1, "All"],
	[2, "Waiting"],
	[3, "Active"],
	[4, "Completed"],
	[5, "Rejected"],
]);

export const StatusMap = new Map([
	["waiting", "orange"],
	["active", "geekblue"],
	["completed", "green"],
	["rejected", "red"],
]);
export const tagColors = [
	"magenta",
	"red",
	"volcano",
	"orange",
	"gold",
	"lime",
	"green",
	"cyan",
	"blue",
	"geekblue",
	"purple",
];

export const SubjectsMap = new Map(
	SchoolSubjects.map((subject, index) => [
		subject,
		tagColors[index % tagColors.length],
	])
);

export const knowsFromMap = new Map([
	["Bekannte", "Über Bekannte/Familie"],
	["Empfehlung", "Über eine Empfehlung"],
	["Schule", "Über Lehrer/Schule"],
	["Universität", "Über die Universität"],
	["Pressebericht", "Über einen Pressebericht"],
	["Radiobeitrag", "Über einen Radiobeitrag"],
	["Fernsehbeitrag", "Über einen Fernsehbeitrag"],
	["Facebook", "Über Facebook"],
	["Instagram", "Über Instagram"],
	["TikTok", "Über TikTok"],
	["Suchmaschine", "Über eine Suchmaschinen-Suche"],
	["Werbeanzeige", "Über eine Werbeanzeige"],
	["13", "anders"],
]);
