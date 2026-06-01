const express = require('express');
const router = express.Router();
const userModel = require('../src/userModel');
const messageModel = require('../src/messageModel');

const NOMDB = "projetDB";



router.put('/:id/status', async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== 'admin') {
			return res.status(403).json({ erreur: "Accès refusé. Réservé aux administrateurs." });
		}
		
		if (req.session.user.id === req.params.id) {
			return res.status(403).json({ erreur: "Vous ne pouvez pas modifier vos propres droits." });
		}

		const { isActive, role } = req.body;
		await userModel.updateUserStatus(NOMDB, "users", req.params.id, isActive, role);
		res.json({ message: "Statut de l'utilisateur mis à jour avec succès !" });
	} catch (error) {
		res.status(500).json({ erreur: "Impossible de modifier l'utilisateur" });
	}
});

router.get('/:login/messages', async (req, res) => {
	try {
		const messages = await messageModel.getMessagesByUser(NOMDB, "messages", req.params.login);
		res.json(messages);
	} catch (error) {
		res.status(500).json({ erreur: "Impossible de récupérer les messages du profil" });
	}
});


// GET /api/users
router.get('/', async (req, res) => {
	try {
		const listUsers = await userModel.getAllUsers(NOMDB, "users");
		res.json(listUsers);
	} catch (error) {
		console.error("Erreur lors de la récupération :", error);
		res.status(500).json({ erreur: "Impossible de récupérer les users" });
	}
});

// GET /api/users/:prenom/:nom
router.get('/:prenom/:nom', async (req, res) => {
	try {
		const user = await userModel.getUser(NOMDB, "users", req.params.prenom, req.params.nom);

		if(user && user.length === 0) {
			return res.status(404).json( {erreur : "User not found"} );
		}

		res.json(user);
	} catch (error) {
		console.error("Erreur lors de la récupération :", error);
		res.status(500).json({ erreur: "Impossible de récupérer l'utilisateur" });
	}
});

// POST /api/users
router.post('/', async (req, res) => {
	try {
		const usr = req.body;
		
		if (!usr.prenom || !usr.nom) {
			return res.status(400).json( {erreur : "Le prénom et le nom sont obligatoires"} );
		}

		await userModel.insertUser(NOMDB, "users", usr);
		res.status(201).json({ message: "Utilisateur créé avec succès !" });
		
	} catch (error) {
		console.error("Erreur lors de l'insertion :", error);
		res.status(500).json({ erreur: "Impossible de créer l'utilisateur" });
	}
});



router.put('/:id/status', async (req, res) => {
	try {
		if (!req.session.user || req.session.user.role !== 'admin') {
			return res.status(403).json({ erreur: "Accès refusé. Réservé aux administrateurs." });
		}
		
		if (req.session.user.id === req.params.id) {
			return res.status(403).json({ erreur: "Vous ne pouvez pas modifier vos propres droits." });
		}

		const { isActive, role } = req.body;
		await userModel.updateUserStatus(NOMDB, "users", req.params.id, isActive, role);
		res.json({ message: "Statut de l'utilisateur mis à jour avec succès !" });
	} catch (error) {
		res.status(500).json({ erreur: "Impossible de modifier l'utilisateur" });
	}
});


router.get('/:login/messages', async (req, res) => {
	try {
		const messages = await messageModel.getMessagesByUser(NOMDB, "messages", req.params.login);
		res.json(messages);
	} catch (error) {
		res.status(500).json({ erreur: "Impossible de récupérer les messages du profil" });
	}
});


// PUT /api/users/:id/role
router.put('/:id/role', async (req, res) => {
	try {
		// 1. Est-ce que l'utilisateur qui fait la requête est bien un admin ?
		if (!req.session.user || req.session.user.role !== 'admin') {
			return res.status(403).json({ erreur: "Accès refusé. Réservé aux administrateurs." });
		}

		// 2. Règle stricte : Un admin ne peut pas modifier ses PROPRES droits
		if (req.session.user.id === req.params.id) {
			return res.status(403).json({ erreur: "Interdit : Vous ne pouvez pas modifier vos propres droits d'administrateur." });
		}

		// 3. On récupère le nouveau rôle envoyé depuis le Front (ex: "admin" ou "user")
		const { role } = req.body; 

		// Petite sécurité supplémentaire
		if (role !== "admin" && role !== "user") {
			return res.status(400).json({ erreur: "Le rôle doit être 'admin' ou 'user'." });
		}

		// 4. On exécute la modification dans la base
		await userModel.updateUserRole(NOMDB, "users", req.params.id, role);
		res.json({ message: `Le rôle a bien été mis à jour vers : ${role}` });

	} catch (error) {
		console.error(error);
		res.status(500).json({ erreur: "Impossible de modifier le rôle de cet utilisateur" });
	}
});

module.exports = router;