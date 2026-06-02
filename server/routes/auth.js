const express = require('express');
const router = express.Router();
const userModel = require('../src/userModel');

const NOMDB = "AndreBertok_DB";

// POST /api/auth/login
router.post('/login', async (req, res) => {
	try {
		const { login, password } = req.body;
		const user = await userModel.getUserByLogin(NOMDB, "users", login);

		if(!user || user.password !== password) {
			return res.status(400).json({ erreur : "Identifiants incorrects" });
		}
		
		// Ajout : Vérification du statut actif
		if(user.isActive === false) {
			return res.status(403).json({ erreur : "Votre compte est en attente de validation par un administrateur." });
		}

		// Ajout : Sauvegarde du rôle
		req.session.user = {
			id: user._id,
			login: user.login,
			prenom: user.prenom,
			nom: user.nom,
			role: user.role || "user",
			age: user.age
		};

		res.json({ message: "Connexion réussie !", user: req.session.user });
	} catch (error) {
		res.status(500).json({ erreur: "Erreur lors de l'authentification" });
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