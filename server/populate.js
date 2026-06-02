const { MongoClient } = require('mongodb');

async function testDB(client, dbName, collectionName) {
	const test = {
		init: true
	}

	const col1 = await client.db(dbName).collection(collectionName);
	const testInit = await col1.findOne(test);

	if(testInit) {
		console.log("DB possede deja des données. Pour la réinitialiser, supprimez la base dans MongoDB Compass.");
	} else {
		console.log("Population de la BD en cours...");
		await populate(client, dbName);
		await col1.insertOne(test);
		console.log("Population terminée avec succès !");
	}
	}

	async function populate(client, dbName) {
	// 1. Liste des utilisateurs
	const listUsers = [
		{ prenom: "Alice", nom: "Dupont", login: "alice", password: "password123", email: "alice.dupont@example.com", age: 28, role: "admin", isActive: true, createdAt: new Date() },
		{ prenom: "Bob", nom: "Martin", login: "bob", password: "password123", email: "bob.martin@example.com", age: 34, role: "user", isActive: true, createdAt: new Date() },
		{ prenom: "Charlie", nom: "Durand", login: "charlie", password: "password123", email: "charlie.durand@example.com", age: 22, role: "user", isActive: false, createdAt: new Date() },
		{ prenom: "Diane", nom: "Lefebvre", login: "diane", password: "password123", email: "diane.lefebvre@example.com", age: 41, role: "editor", isActive: true, createdAt: new Date() },
		{ prenom: "Emile", nom: "Moreau", login: "emile", password: "password123", email: "emile.moreau@example.com", age: 19, role: "user", isActive: true, createdAt: new Date() },
		{ prenom: "Fanny", nom: "Laurent", login: "fanny", password: "password123", email: "fanny.laurent@example.com", age: 30, role: "user", isActive: true, createdAt: new Date() },
		{ prenom: "Gaston", nom: "Simon", login: "gaston", password: "password123", email: "gaston.simon@example.com", age: 55, role: "admin", isActive: true, createdAt: new Date() },
		{ prenom: "Hélène", nom: "Michel", login: "helene", password: "password123", email: "helene.michel@example.com", age: 27, role: "editor", isActive: false, createdAt: new Date() },
		{ prenom: "Igor", nom: "Garcia", login: "igor", password: "password123", email: "igor.garcia@example.com", age: 38, role: "user", isActive: true, createdAt: new Date() }
	];

	const userCollection = await client.db(dbName).collection("users");
	await userCollection.insertMany(listUsers);

	// 2. Liste des messages (Mise à jour avec la bonne structure)
	const listMessage = [
		{
			forum_id: "forum_ouvert",
			title: "Problème avec flexbox en CSS",
			text: "Bonjour, je n'arrive pas à centrer ma div verticalement, quelqu'un a une astuce ?",
			author: "bob",
			authorPrenom: "Bob",
			date: new Date("2023-10-01T09:30:00Z"),
			comments: []
		},
		{
			forum_id: "forum_ouvert",
			title: "Sortie de Node.js 21",
			text: "Avez-vous vu les nouvelles fonctionnalités de la dernière version ? C'est incroyable.",
			author: "diane",
			authorPrenom: "Diane",
			date: new Date("2023-10-02T14:15:00Z"),
			comments: [
				{ author: "emile", authorPrenom: "Emile", text: "Oui, le fetch natif est enfin stable !", date: new Date("2023-10-02T14:30:00Z") }
			]
		},
		{
			forum_id: "forum_ouvert",
			title: "Recherche de joueurs pour ce soir",
			text: "On fait une session multijoueur à 21h, ajoutez-moi si vous êtes chauds.",
			author: "igor",
			authorPrenom: "Igor",
			date: new Date("2023-10-05T18:00:00Z"),
			comments: []
		},
		{
			// Message sans titre
			forum_id: "forum_ouvert",
			title: "Sans titre",
			text: "Je suis d'accord avec le message précédent, c'est exactement ce que je pensais.",
			author: "fanny",
			authorPrenom: "Fanny",
			date: new Date("2023-10-06T10:20:00Z"),
			comments: []
		},
		{
			// Message Admin dans le forum fermé !
			forum_id: "forum_ferme",
			title: "Organisation de la prochaine réunion",
			text: "Bonjour l'équipe d'administration. N'oubliez pas notre point de synchronisation ce vendredi.",
			author: "alice", // Alice est admin
			authorPrenom: "Alice",
			date: new Date("2023-10-10T08:00:00Z"),
			comments: [
				{ author: "gaston", authorPrenom: "Gaston", text: "C'est noté pour moi !", date: new Date("2023-10-10T09:15:00Z") }
			]
		},
		{
			forum_id: "forum_ouvert",
			title: "MongoDB vs PostgreSQL ?",
			text: "Pour un projet e-commerce, vous recommandez plutôt du NoSQL ou du SQL classique ?",
			author: "emile",
			authorPrenom: "Emile",
			date: new Date("2023-10-12T11:45:00Z"),
			comments: []
		},
		{
			forum_id: "forum_ouvert",
			title: "Quel temps chez vous ?",
			text: "Ici il pleut depuis 3 jours, j'en peux plus ☔️",
			author: "bob",
			authorPrenom: "Bob",
			date: new Date("2023-10-15T07:10:00Z"),
			comments: []
		},
		{
			forum_id: "forum_ouvert",
			title: "Avis sur le dernier Zelda",
			text: "Je viens de le finir, la fin est un peu décevante je trouve. Qu'en pensez-vous ?",
			author: "igor",
			authorPrenom: "Igor",
			date: new Date("2023-10-16T22:30:00Z"),
			comments: [
				{ author: "diane", authorPrenom: "Diane", text: "Totalement d'accord, le boss final était trop facile.", date: new Date("2023-10-16T22:45:00Z") },
				{ author: "fanny", authorPrenom: "Fanny", text: "Moi j'ai bien aimé la direction artistique par contre.", date: new Date("2023-10-17T09:00:00Z") }
			]
		},
		{
			// Un autre message dans le forum fermé
			forum_id: "forum_ferme",
			title: "Mise à jour du serveur",
			text: "Le serveur sera en maintenance ce soir pour appliquer les patchs de sécurité.",
			author: "gaston", // Gaston est admin
			authorPrenom: "Gaston",
			date: new Date("2023-10-20T14:00:00Z"),
			comments: []
		}
	];

	const messCollection = await client.db(dbName).collection("messages");
	await messCollection.insertMany(listMessage);
	}

	async function main() {
	const uri = "mongodb://localhost";
	const client = new MongoClient(uri);

	try {
		await client.connect();
		await testDB(client, "AndreBertok_DB", "testing");

	} catch(e) {
		console.log(e);
	} finally {
		await client.close();
	}
}

module.exports = main;