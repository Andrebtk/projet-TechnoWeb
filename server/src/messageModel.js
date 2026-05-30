const connectDB = require('./db');
const { ObjectId } = require('mongodb')

async function getAllMessages(dbName, collectionName) {
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


async function insertMessage(dbName, collectionName, messageData) {
	try {
		const client = await connectDB();
		
		messageData.date = new Date();
		
		const res = client
						.db(dbName)
						.collection(collectionName)
						.insertOne(messageData);
		
		return res;
	}
	catch (e) {
		console.log("Erreur lors de l'insertion du message : ", e);
		throw e;
	}
}

async function deleteMessage(dbName, collectionName, messageId) {
	try {
		const clien = await connectDB();
		const result = await client
								.bd(dbName)
								.collection(collectionName)
								.deleteOne({ _id: new ObjectId(messageId)});
		return result;
	}
	catch (e) {
		console.log("Erreur lors de la suppression :", e);
		throw e;
	}
}


async function getMessageById(dbName, collecitonName, messageId) {
	const client = await connectDB();
	return await client.db(dbName).collection(collecitonName).findOne({_id : new ObjectId(messageId)});
}

async function updateMessage(dbName, collectionName, messageId, newText) {
	try {
		const client = await connectDB();
		const result = await client
								.db(dbName)
								.collection(collectionName)
								.updateOne(
									{ _id: new ObjectId(messageId) },
									{ $set : { text: newText } }
								);
		return result;
	}
	catch (e) {
		console.error("Erreur lors de la mise à jour :", e);
		throw e;
	}
}

async function addComment(dbName, collectionName, messageId, commentData) {
	try {
		const client = await connectDB();

		commentData.date = new Date();

		const result = await client
								.db(dbName)
								.collection(collectionName)
								.updateOne(
									{ _id: new ObjectId(messageId) },
									{ $push : {comments: commentData}}
								);
		return result;
	}
	catch (e) {
		console.error("Erreur lors de l'ajout du commentaire :", e);
		throw e;
	}
}

async function searchMessages(dbName, collectionName, keyword) {
	try {
		const client = await connectDB();
		const regex = new RegExp(keyword, 'i');

		const result = await client 
								.db(dbName)
								.collection(collectionName)
								.find({
									$or : [
										{ title : { $regex: regex} },
										{ text: { $regex : regex} }
									]
								})
								.sort({date : -1})
								.toArray();
		return result;
	}
	catch (e) {
		console.error("Erreur lors de la recherche :", e);
		throw e;
	}
}



module.exports = {
	getAllMessages,
	insertMessage,
	insertMessage,
	getMessageById,
	updateMessage,
	addComment,
	searchMessages
}