const express = require('express');
const router = express.Router();
const messageModel = require('../src/messageModel');

const NOMDB = "projetDB";

// GET /api/messages
router.get('/', async (req, res) => {
	try {
		const messages = await messageModel.getAllMessages(NOMDB, "messages");
		res.json(messages);
	} catch (error) {
		res.status(500).json({ erreur: "Impossible de récupérer les messages" });
	}
})

// POST /api/messages
router.post('/', async (req, res) => {
	try {
		if(!req.session.user) {
			return res.status(401).json({erreur: "Vous devez être connecté pour poster." });
		}

		const {title, text} = req.body;

		if (!text) {
			return res.status(400).json({ erreur: "Le contenu du message est obligatoire." });
		}

		const newMessage = {
			title: title || "Sans titre",
			text: text,
			author: req.session.user.login,
			authorPrenom: req.session.user.prenom
		}

		const result = await messageModel.insertMessage(NOMDB, "messages", newMessage);
		res.status(201).json({ message: "Message posté !", id: result.insertedId });

	} catch (e) {
		console.error("Erreur lors de la création du message :", e);
		res.status(500).json({ erreur: "Impossible de poster le message" });
	}
});

// GET /api/messages/search
router.get('/search', async (req, res) => {
	try {
		const keyword = req.query.q;

		if(!keyword) {
			return res.status(400).json({erreur: "Veuillez fournir un mot-clé de recherche"});
		}

		const messages = await messageModel.searchMessages(NOMDB, "messages", keyword);
		res.json(messages);
	} catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la recherche" });
	}
});


// DELETE /api/messages/:id
router.delete('/:id', async (req, res) => {
	try {
		if (!req.session.user) {
			return res.status(401).json({ erreur: "Non connecté" });
		}

		const messageId = req.params.id;
		const message = await messageModel.getMessageById(NOMDB, "messages", messageId);

		if (!message) {
			return res.status(404).json({ erreur: "Message introuvable" });
		}

		if(message.author !== req.session.user.login) {
			return res.status(403).json({ erreur: "Tu n'as pas le droit de supprimer ce message !" });
		}

		await messageModel.deleteMessage(NOMDB, "messages", messageId);
		res.json({message : "Message supprimé avec succès"})
	} catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la suppression" });
	}
});

// PUT /api/messages/:id
router.put('/:id', async (req, res) => {
	try {
		if(!req.session.user) {
			return res.status(401).json({erreur: "Non connecté"});
		}

		const messageId = req.params.id;
		const {text} = req.body;
		
		if(!text) {
			return res.status(400).json({erreur: "Le nouveau texte est obligatoire"});
		}

		const message = await messageModel.getMessageById(NOMDB, "messages", messageId);

		if(!message) {
			return res.status(404).json({ erreur: "Message introuvable" });
		}

		if(message.author !== req.session.user.login) {
			return res.status(403).json({ erreur: "Tu n'as pas le droit de modifier ce message !" });
		}

		await messageModel.updateMessage(NOMDB, "messages", messageId, text);
		res.json({ message: "Message mis à jour avec succès !" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la modification" });
	}
});

// POST /api/messages/:id/comments
router.post('/:id/comments' , async (req, res) => {
	try {
		if (!req.session.user) {
			return res.status(401).json({ erreur: "Connectez-vous pour commenter." });
		}

		const messageId = req.params.id;
		const { text } = req.body;

		if(!text) {
			return res.status(400).json({ erreur: "Le texte du commentaire est requis." });
		}

		const message = await messageModel.getMessageById(NOMDB, "messages", messageId);
		
		if(!message) {
			return res.status(404).json({ erreur: "Le message original n'existe plus." });
		}

		const newComment = {
			text: text,
			author: req.session.user.login,
			authorPrenom: req.session.user.prenom
		};

		await messageModel.addComment(NOMDB, "messages", messageId, newComment);
		res.status(201).json({ message: "Commentaire ajouté avec succès !" });
	} catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de l'ajout du commentaire" });
	}
});

module.exports = router;