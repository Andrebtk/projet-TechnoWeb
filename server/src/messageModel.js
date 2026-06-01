const connectDB = require('./db');
const { ObjectId } = require('mongodb')

async function getAllMessages(dbName, collectionName, userRole) {
	try {

		const client = await connectDB();
		// Si l'user n'est pas admin, il ne voit pas les messages avec forum_id = "forum_ferme"
		const query = userRole === 'admin' ? {} : { forum_id: { $ne: "forum_ferme" } };
		
		return await client.db(dbName)
						.collection(collectionName)
						.find(query)
						.sort({date: -1})
						.toArray();

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
		const client = await connectDB();
		const result = await client
								.db(dbName)
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

async function updateMessage(dbName, collectionName, messageId, newTitle, newText) {
	try {
		const client = await connectDB();
		const result = await client
			.db(dbName)
			.collection(collectionName)
			.updateOne(
				{ _id: new ObjectId(messageId) },
				{ $set : { title: newTitle, text: newText, isEdited: true } }
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

async function searchMessages(dbName, collectionName, filters, userRole) {
	try {
		const client = await connectDB();
		
		// On gère l'accès au forum fermé
		const query = userRole === 'admin' ? {} : { forum_id: { $ne: "forum_ferme" } };

		// Recherche par mot-clé (Titre ou Texte)
		if (filters.keyword) {
			const regex = new RegExp(filters.keyword, 'i');
			query.$or = [{ title: { $regex: regex } }, { text: { $regex: regex } }];
		}

		// Recherche par auteur (login)
		if (filters.author) {
			query.author = filters.author;
		}
		
		// Recherche par dates
		if (filters.startDate || filters.endDate) {
			query.date = {};
			if (filters.startDate) query.date.$gte = new Date(filters.startDate);
			// On ajoute 23h59 à la date de fin pour inclure toute la journée
			if (filters.endDate) query.date.$lte = new Date(filters.endDate + "T23:59:59Z"); 
		}

		return await client.db(dbName)
							.collection(collectionName)
							.find(query)
							.sort({date: -1})
							.toArray();
	}
	catch (e) {
		console.error("Erreur lors de la recherche :", e);
		throw e;
	}
}

async function getMessagesByUser(dbName, collectionName, login) {
	const client = await connectDB();
	return await client.db(dbName)
						.collection(collectionName)
						.find({ author: login })
						.sort({date: -1})
						.toArray();
}



module.exports = {
	getAllMessages,
	insertMessage,
	deleteMessage,
	getMessageById,
	updateMessage,
	addComment,
	searchMessages,
	getMessagesByUser
}