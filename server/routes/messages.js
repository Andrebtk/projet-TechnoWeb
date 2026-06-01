const express = require('express');
const router = express.Router();
const messageModel = require('../src/messageModel');

const NOMDB = "projetDB";

// GET /api/messages
// GET /api/messages
router.get('/', async (req, res) => {
	try {
		// 1. On vérifie le rôle de la personne connectée (si non connecté, c'est un 'user' par défaut)
		const userRole = req.session.user ? req.session.user.role : 'user';

		// 2. On passe ce rôle à la fonction du modèle !
		// (Vérifie bien que le nom de ta BDD correspond à ta constante, ex: NOMDB ou autre)
		const messages = await messageModel.getAllMessages(NOMDB, "messages", userRole);
		
		res.json(messages);
	} catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la récupération des messages" });
	}
});

// POST /api/messages
router.post('/', async (req, res) => {
	try {
		if(!req.session.user) {
			return res.status(401).json({erreur: "Non connecté"});
		}

		const { title, text, forum_id } = req.body;
		
		if(!text) {
			return res.status(400).json({erreur: "Le texte est obligatoire"});
		}

		// Sécurité : Par défaut, c'est ouvert. 
		// Si c'est un admin qui demande le forum fermé, on valide le forum fermé.
		let targetForum = "forum_ouvert";
		if (req.session.user.role === 'admin' && forum_id === "forum_ferme") {
			targetForum = "forum_ferme";
		}

		// On crée l'objet du nouveau message
		const newMessage = {
			title: title || "",
			text: text,
			author: req.session.user.login,
			authorPrenom: req.session.user.prenom,
			date: new Date(),
			comments: [],
			forum_id: targetForum
		};

		// CORRECTION : On utilise bien insertMessage ici !
		const result = await messageModel.insertMessage(NOMDB, "messages", newMessage);
		
		res.status(201).json({ message: "Message posté !", id: result.insertedId });
	} catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la création" });
	}
});

// GET /api/messages/search
router.get('/search', async (req, res) => {
	try {
		const userRole = req.session.user ? req.session.user.role : 'user';
		
		const filters = {
			keyword: req.query.q,
			author: req.query.author,
			startDate: req.query.startDate,
			endDate: req.query.endDate
		};

		if(!filters.keyword && !filters.author && !filters.startDate && !filters.endDate) {
			return res.status(400).json({erreur: "Veuillez fournir au moins un critère de recherche"});
		}

		const messages = await messageModel.searchMessages(NOMDB, "messages", filters, userRole);
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
		const {title, text} = req.body;
		
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

		// On garde l'ancien titre si le nouveau est vide
		const finalTitle = title !== undefined ? title : message.title;

		await messageModel.updateMessage(NOMDB, "messages", messageId, finalTitle, text);
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