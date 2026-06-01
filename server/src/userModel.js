const connectDB = require('./db');
const { ObjectId } = require('mongodb');

async function insertUser(dbName, collectionName, userData) {
	const client = await connectDB();
	userData.createdAt = new Date();
	userData.isActive = false; 
	userData.role = "user";

	return await client.db(dbName).collection(collectionName).insertOne(userData);
}


async function updateUserStatus(dbName, collectionName, userId, isActive, role) {
	const client = await connectDB();
	return await client.db(dbName).collection(collectionName).updateOne(
		{ _id: new ObjectId(userId) },
		{ $set: { isActive: isActive, role: role } }
	);
}


async function getUserByLogin(dbName, collectionName, loginReq) {
	try {
		const client = await connectDB();

		const query = {
			login: loginReq
		}


		const user = client
						.db(dbName)
						.collection(collectionName)
						.findOne(query);

		return user;


	} catch (e) {
		console.error("Erreur lors de l'insertion de l'utilisateur : ", e);
		throw e;
	}
}


async function getUser(dbName, collectionName, prenomReq, nomReq) {
	try {
		const client = await connectDB();

		const query = {
			prenom: prenomReq,
			nom: nomReq
		}

		const projection = {}

		const user = client
						.db(dbName)
						.collection(collectionName)
						.findOne(query, projection);

		return user;

	} catch (e) {
		console.error("Erreur lors de la récupération de l'user :", e);
		throw e;
	}
}

async function getAllUsers(dbName, collectionName) {
	try {
		const client = await connectDB();

		const query = {}
		const projection = {}

		const listMessages = client
								.db(dbName)
								.collection(collectionName)
								.find(query, projection);

		return await listMessages.toArray();

	} catch (e) {
		console.error("Erreur lors de la récupération des messages :", e);
		throw e;
	}
}


async function updateUserRole(dbName, collectionName, userId, newRole) {
	const client = await connectDB();
	return await client.db(dbName).collection(collectionName).updateOne(
		{ _id: new ObjectId(userId) },
		{ $set: { role: newRole } } 
	);
}


module.exports = {
	insertUser,
	getUserByLogin,
	getUser,
	getAllUsers,
	updateUserStatus,
	updateUserRole
}