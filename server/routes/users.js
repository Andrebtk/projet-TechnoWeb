const express = require('express');
const router = express.Router();
const userModel = require('../src/userModel');

const NOMDB = "projetDB";

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

module.exports = router;