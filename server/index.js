const express = require("express");
const http = require("http");
const { Server } = require("socket.io")

const cors = require("cors");
const session = require('express-session');
const populateDB = require('./populate');


const app = express();
const server = http.createServer(app);


const io = new Server(server, {
	cors: {
		origin: "http://localhost:5173",
		credentials: true
	}
})


// Importation des routeurs
const messageRoutes = require('./routes/messages');
const userRoutes = require('./routes/users');
const authRoutes = require('./routes/auth');

app.use(cors({
	origin: 'http://localhost:5173', 	// URL de ton frontend Vite/React
	credentials: true					// Autorise l'envoi du cookie de session
}));

app.use(express.json());


io.on('connection', (socket) => {
	console.log('Un utilisateur est connecté aux WebSockets');

	socket.on('join_chat', (userData) => {
		socket.join('room_public'); 
		
		if (userData && userData.role === 'admin') {
			socket.join('room_admin');
			console.log('Un Admin a rejoint la salle privée');
		}
	});

	socket.on('nouveau_message', (data) => {
		const targetRoom = data.room === 'admin' ? 'room_admin' : 'room_public';
		
		io.to(targetRoom).emit('reception_message', data);
	});

	socket.on('disconnect', () => {
		console.log('Un utilisateur s\'est déconnecté');
	});
});


const PORT = 3001;
const NOMDB = "AndreBertok_DB"



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


// Express redirige le trafic vers les bons fichiers
app.use('/api/messages', messageRoutes);
app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);



// LANCEMENT DU SERVEUR ET INITIALISATION BDD
populateDB(NOMDB).then(() => {
	server.listen(PORT, () => { 
		console.log("Serveur OK ! - port : " + PORT); 
	});
}).catch((err) => {
	console.error("Erreur lors de l'initialisation de la base de données :", err);
});