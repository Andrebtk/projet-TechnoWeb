const express = require('express');
const router = express.Router();
const userModel = require('../src/userModel');

const NOMDB = "projetDB";

// POST /api/auth/login
router.post('/login', async (req, res) => {
	try {
		const login = req.body.login;
		const password = req.body.password;

		// Test si le login existe  
		const user = await userModel.getUserByLogin(NOMDB, "users", login);

		if(!user) {
			return res.status(400).json({ erreur : "Identifiants incorrects" });
		}
		
		// Test si le login + password est bon
		if(user.password !== password) {
			return res.status(400).json({ erreur : "Identifiants incorrects" });
		}

		// Création de la session
		req.session.user = {
			id: user._id,
			login: user.login,
			prenom: user.prenom,
			nom: user.nom
		};

		res.json({ message: "Connexion réussie !", user: req.session.user });

	} catch (error) {
		console.error("Erreur lors de la l'authentification :", error);
		res.status(500).json({ erreur: "Erreur lors de la l'authentification" });
	}
});

// GET /api/auth/me
router.get('/me', (req, res) => {
	if(req.session.user){
		res.json({ connected: true, user: req.session.user });
	} 
	else {
		res.status(401).json({ connected: false, message: "Non connecté" });
	}
});

// GET /api/auth/logout
router.get('/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).send("Erreur lors de la déconnexion");
		res.clearCookie('connect.sid');
		res.json({ message: "Déconnexion réussie" });
	});
});

module.exports = router;