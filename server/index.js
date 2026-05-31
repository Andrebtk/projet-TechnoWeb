const express = require("express");
const app = express();
const cors = require("cors");
const session = require('express-session')

const userModel = require('./src/userModel');
const messageModel = require('./src/messageModel');

app.use(cors({
    origin: 'http://localhost:5173', // URL de ton frontend Vite/React
    credentials: true                // Autorise l'envoi du cookie de session
}));

app.use(express.json());

const PORT = 3001;
const NOMDB = "projetDB"



app.use(session({
	secret: "MonPassword",
	resave: false,					// Ne pas sauvegarder la session si elle n'est pas modifiée
	saveUninitialized: false,		// Pas de création de session tant que rien n'est sauvegardé
	cookie: {
		secure: false, 				// car en HTTP
		maxAge: 1000 * 60 * 60 		// La session dure 1h
	}
}));




app.use('/api/status', (req, res) => {
	res.send('Serveur fonctionne bien !');
})

// API - Messages
app.get('/api/messages', async (req, res) => {
	try {
		const messages = await messageModel.getAllMessages(NOMDB, "messages");

		res.json(messages);
	} catch (error) {
		console.error("Erreur lors de la récupération :", error);
		res.status(500).json({ erreur: "Impossible de récupérer les messages" });
	}
})

app.post('/api/messages', async (req, res) => {
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

	}
	catch (e) {
		console.error("Erreur lors de la création du message :", e);
		res.status(500).json({ erreur: "Impossible de poster le message" });
	}
})


app.get('/api/messages/search', async (req, res) => {
	try {

		const keyword = req.query.q;

		if(!keyword) {
			return res.status(400).json({erreur: "Veuillez fournir un mot-clé de recherche"});
		}

		const messages = await messageModel.searchMessages(NOMDB, "messages", keyword);
		
		res.json(messages);
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la recherche" });
	}
})


app.delete('/api/messages/:id', async (req, res) => {
	try {
		if (!req.session.user) {
			return res.status(401).json({ erreur: "Non connecté" });
		}

		const messageId = req.params.id;

		const message = await messageModel.getMessageById(NOMDB, "messages", messageId);

		if (!message) {
			return res.status(404).json({ erreur: "Message introuvable" });
		}

		// Est-ce que c'est bien l'auteur ?
		if(message.author !== req.sessions.user.login) {
			return res.status(403).json({ erreur: "Tu n'as pas le droit de supprimer ce message !" });
		}

		await messageModel.deleteMessage(NOMDB, "messages", messageId);
		res.json({message : "message supprimé avec succès"})
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la suppression" });
	}
})

app.put('/api/messages/:id', async (req, res) => {
	try {

		if(!req.session.user) {
			return res.status(401).json({erreur: "Non connecté"});
		}

		const messageId = req.params.id;
		const {text} = req.body;
		
		if(!text) {
			return res.status(400).json({erreur: "Le novueau texte est obligatoire"});
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
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de la modification" });
	}
})


app.post('/api/messages/:id/comments' , async (req, res) => {
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
	}
	catch (e) {
		console.error(e);
		res.status(500).json({ erreur: "Erreur lors de l'ajout du commentaire" });
	}
})





// API - Users
app.get('/api/users', async (req, res) => {
		try {
		const listUsers = await userModel.getAllUsers(NOMDB, "users");

		res.json(listUsers);
	} catch (error) {
		console.error("Erreur lors de la récupération :", error);
		res.status(500).json({ erreur: "Impossible de récupérer les users" });
	}
})

app.get('/api/user/:prenom/:nom', async (req, res) => {
	try {
		const user = await userModel.getUser(NOMDB, "users", req.params.prenom, req.params.nom);

		if(user.length == 0) {
			return res.status(404).json( {erreur : "User not found"} );
		}

		res.json(user);
	} catch (error) {
		console.error("Erreur lors de la récupération :", error);
		res.status(500).json({ erreur: "Impossible de récupérer les users" });
	}
})


app.post('/api/users', async (req, res) => {
	try {
		const usr = req.body;
		
		if (!usr.prenom || !usr.nom) {
			return res.status(400).json( {erreur : "Le prénom et le nom sont obligatoires"} );
		}

		const resultat = await userModel.insertUser(NOMDB, "users", usr);
		
		res.status(201).json({
			message: "Utilisateur créé avec succès !", 
		})
		
	} catch (error) {
		console.error("Erreur lors de la récupération :", error);
		res.status(500).json({ erreur: "Impossible de récupérer les users" });
	}
})


// API - LOGIN
app.post('/api/auth/login', async (req, res) => {
	try {

		const login = req.body.login;
		const password = req.body.password;


		// Test si le login existe  
		const user = await userModel.getUserByLogin(NOMDB, "users", login);

		if(!user) {
			return res.status(400).json({
				erreur : "Identifiants incorrects"
			});
		}
		

		// Test si le login + password est bon
		if(user.password != password) {
			return res.status(400).json({
				erreur : "Identifiants incorrects"
			});
		}

		req.session.user = {
			id: user._id,
			login: user.login,
			prenom: user.prenom,
			nom: user.nom
		}

		res.json({ message: "Connexion réussie !", user: req.session.user });

	} catch (error) {
		console.error("Erreur lors de la l'authentification :", error);
		res.status(500).json({ erreur: "Erreur lors de la l'authentification" });
	}
})

app.get('/api/auth/me', (req, res) => {
	if(req.session.user){
		res.json({ connected: true, user: req.session.user });
	} 
	else {
		res.status(401).json({ connected: false, message: "Non connecté" });
	}
});

app.get('/api/auth/logout', (req, res) => {
	req.session.destroy((err) => {
		if (err) return res.status(500).send("Erreur lors de la déconnexion");
		res.clearCookie('connect.sid'); // Supprime le cookie côté client
		res.json({ message: "Déconnexion réussie" });
	})
})





app.use('/', (req, res) => {
	res.send('test');
})


app.listen(PORT, () => { 
	console.log("Serveur OK ! - port : " + PORT); 
})