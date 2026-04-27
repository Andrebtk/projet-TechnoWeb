const { MongoClient } = require('mongodb');



const uri = "mongodb://localhost";
const client = new MongoClient(uri);
let isConnected = false;


async function connectDB(){
	try {
		if(!isConnected) {
			await client.connect();
			isConnected = true;
			console.log("Connexion à MongoDB réussie !")
		}
		return client;

	} catch (err) {
		console.log("Erreur de connexion à la base de données :", err);
		throw err;
	}
}


module.exports = connectDB;