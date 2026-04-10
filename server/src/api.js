const { MongoClient } = require('mongodb');


const uri = "mongodb://localhost";
const client = new MongoClient(uri);

let isConnected = false;

async function connectDB(){
    if(!isConnected) {
        await client.connect();
        isConnected = true;
        console.log("Connexion à MongoDB réussie !")
    }
}

async function getAllMessages(dbName, collectionName) {
    try {

        connectDB();

        query = {}
        projection = {}

        const listMessages = client
                                .db(dbName)
                                .collection(collectionName)
                                .find(query, projection);

        return await listMessages.toArray();

    } catch (e) {
        console.error("Erreur lors de la récupération des messages :", e);
        throw e;
    } 
}

async function getAllUsers(dbName, collectionName) {
    try {
        connectDB();

        query = {}
        projection = {}

        const listMessages = client
                                .db(dbName)
                                .collection(collectionName)
                                .find(query, projection);

        return await listMessages.toArray();

    } catch (e) {
        console.error("Erreur lors de la récupération des messages :", e);
        throw e;
    }
}


async function getUser(dbName, collectionName, prenomReq, nomReq) {
    try {
        connectDB();

        query = {
            prenom: prenomReq,
            nom: nomReq
        }

        projection = {}

        const user = client
                        .db(dbName)
                        .collection(collectionName)
                        .find(query, projection);

        return await user.toArray();

    } catch (e) {
        console.error("Erreur lors de la récupération de l'user :", e);
        throw e;
    }
}



async function insertUser(dbName, collectionName, userData) {
    try {
        connectDB();

        userData.createdAt = new Date();

        const result = client
                        .db(dbName)
                        .collection(collectionName)
                        .insertOne(userData);

        return result;

    } catch (e) {
        console.error("Erreur lors de l'insertion de l'utilisateur : ", e);
        throw e;
    }
}

async function getUserByLogin(dbName, collectionName, loginReq) {
    try {
        connectDB();

        query = {
            login: loginReq
        }

        projection = {}

        const user = client
                        .db(dbName)
                        .collection(collectionName)
                        .find(query, projection);

        return await user.toArray();


    } catch (e) {
        console.error("Erreur lors de l'insertion de l'utilisateur : ", e);
        throw e;
    }
}



module.exports = { 
    getAllMessages, 
    getAllUsers, 
    getUser, 
    insertUser, 
    getUserByLogin
};