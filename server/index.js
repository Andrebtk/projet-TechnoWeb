const express = require("express");
const app = express();
const cors = require("cors");

const api = require('./src/api')

app.use(cors());
app.use(express.json());

const PORT = 3001;
const NOMDB = "projetDB"

app.use('/api/status', (req, res) => {
    res.send('Serveur fonctionne bien !');
})

// API - Messages
app.get('/api/messages', async (req, res) => {
    try {
        const messages = await api.getAllMessages(NOMDB, "messages");

        res.json(messages);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        res.status(500).json({ erreur: "Impossible de récupérer les messages" });
    }
})


// API - Users
app.get('/api/users', async (req, res) => {
     try {
        const listUsers = await api.getAllUsers(NOMDB, "users");

        res.json(listUsers);
    } catch (error) {
        console.error("Erreur lors de la récupération :", error);
        res.status(500).json({ erreur: "Impossible de récupérer les users" });
    }
})

app.get('/api/user/:prenom/:nom', async (req, res) => {
    try {
        const user = await api.getUser(NOMDB, "users", req.params.prenom, req.params.nom);

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

        const resultat = await api.insertUser(NOMDB, "users", usr);
        
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
        const response = await api.getUserByLogin(NOMDB, "users", login);

        if(response.length == 0) {
            return res.status(400).json({
                erreur : "Identifiants incorrects"
            });
        }
        

        // Test si le login + password est bon
        if(response[0].password != password) {
            return res.status(400).json({
                erreur : "Identifiants incorrects"
            });
        }

        res.json({response: "OK"})

    } catch (error) {
        console.error("Erreur lors de la l'authentification :", error);
        res.status(500).json({ erreur: "Erreur lors de la l'authentification" });
    }
})



app.use('/', (req, res) => {
    res.send('test');
})


app.listen(PORT, () => { 
    console.log("Serveur OK ! - port : " + PORT); 
})