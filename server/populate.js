const { MongoClient } = require('mongodb');

async function fillDB(client, dbName, collectionName) {
    test = {
        init: true
    }

    const col1 = await client.db(dbName).collection(collectionName);
    const testInit = await col1.findOne(test);

    if(testInit) {
        console.log("trouve");
    } else {
        console.log("Non trouver");
        console.log("Population de la BD");
        await populate(client, dbName);

        await col1.insertOne(test);
    }
}

async function populate(client, dbName) {
    const listUsers = [
        { prenom: "Alice", nom: "Dupont", email: "alice.dupont@example.com", age: 28, role: "admin", isActive: true, createdAt: new Date() },
        { prenom: "Bob", nom: "Martin", email: "bob.martin@example.com", age: 34, role: "user", isActive: true, createdAt: new Date() },
        { prenom: "Charlie", nom: "Durand", email: "charlie.durand@example.com", age: 22, role: "user", isActive: false, createdAt: new Date() },
        { prenom: "Diane", nom: "Lefebvre", email: "diane.lefebvre@example.com", age: 41, role: "editor", isActive: true, createdAt: new Date() },
        { prenom: "Emile", nom: "Moreau", email: "emile.moreau@example.com", age: 19, role: "user", isActive: true, createdAt: new Date() },
        { prenom: "Fanny", nom: "Laurent", email: "fanny.laurent@example.com", age: 30, role: "user", isActive: true, createdAt: new Date() },
        { prenom: "Gaston", nom: "Simon", email: "gaston.simon@example.com", age: 55, role: "admin", isActive: true, createdAt: new Date() },
        { prenom: "Hélène", nom: "Michel", email: "helene.michel@example.com", age: 27, role: "editor", isActive: false, createdAt: new Date() },
        { prenom: "Igor", nom: "Garcia", email: "igor.garcia@example.com", age: 38, role: "user", isActive: true, createdAt: new Date() },
    ];

    const userCollection = await client.db(dbName).collection("users");
    await userCollection.insertMany(listUsers);



    const listMessage = [
        {
            message_id: "msg_001",
            id_user: "user_05", // Fait référence à un utilisateur
            forum_id: "forum_tech",
            title: "Problème avec flexbox en CSS",
            text: "Bonjour, je n'arrive pas à centrer ma div verticalement, quelqu'un a une astuce ?",
            date: new Date("2023-10-01T09:30:00Z"),
            comments: [],
            userStatus: "online"
        },
        {
            message_id: "msg_002",
            id_user: "user_12",
            forum_id: "forum_tech",
            title: "Sortie de Node.js 21",
            text: "Avez-vous vu les nouvelles fonctionnalités de la dernière version ? C'est incroyable.",
            date: new Date("2023-10-02T14:15:00Z"),
            comments: [
                { id_user: "user_08", text: "Oui, le fetch natif est enfin stable !", date: new Date("2023-10-02T14:30:00Z") }
            ],
            userStatus: "offline"
        },
        {
            message_id: "msg_003",
            id_user: "user_03",
            forum_id: "forum_jeux",
            title: "Recherche de joueurs pour ce soir",
            text: "On fait une session multijoueur à 21h, ajoutez-moi si vous êtes chauds.",
            date: new Date("2023-10-05T18:00:00Z"),
            comments: [],
            userStatus: "in-game"
        },
        {
            // Message sans titre (comme demandé : "souvent un title", donc parfois non)
            message_id: "msg_004",
            id_user: "user_19",
            forum_id: "forum_general",
            text: "Je suis d'accord avec le message précédent, c'est exactement ce que je pensais.",
            date: new Date("2023-10-06T10:20:00Z"),
            comments: [],
            userStatus: "online"
        },
        {
            message_id: "msg_005",
            id_user: "user_01", // Un admin
            forum_id: "forum_annonces",
            title: "Mise à jour des règles du forum",
            text: "Merci de lire le nouveau règlement avant de poster. Les insultes vaudront un ban définitif.",
            date: new Date("2023-10-10T08:00:00Z"),
            comments: [],
            userStatus: "do-not-disturb"
        },
        {
            message_id: "msg_006",
            id_user: "user_08",
            forum_id: "forum_tech",
            title: "MongoDB vs PostgreSQL ?",
            text: "Pour un projet e-commerce, vous recommandez plutôt du NoSQL ou du SQL classique ?",
            date: new Date("2023-10-12T11:45:00Z"),
            comments: [],
            userStatus: "offline"
        },
        {
            message_id: "msg_007",
            id_user: "user_14",
            forum_id: "forum_general",
            title: "Quel temps chez vous ?",
            text: "Ici il pleut depuis 3 jours, j'en peux plus ☔️",
            date: new Date("2023-10-15T07:10:00Z"),
            comments: [],
            userStatus: "online"
        },
        {
            message_id: "msg_008",
            id_user: "user_07",
            forum_id: "forum_jeux",
            title: "Avis sur le dernier Zelda",
            text: "Je viens de le finir, la fin est un peu décevante je trouve. Qu'en pensez-vous ?",
            date: new Date("2023-10-16T22:30:00Z"),
            comments: [
                { id_user: "user_03", text: "Totalement d'accord, le boss final était trop facile.", date: new Date("2023-10-16T22:45:00Z") },
                { id_user: "user_11", text: "Moi j'ai bien aimé la direction artistique par contre.", date: new Date("2023-10-17T09:00:00Z") }
            ],
            userStatus: "offline"
        },
        {
            // Un autre message sans titre
            message_id: "msg_009",
            id_user: "user_20",
            forum_id: "forum_tech",
            text: "Merci pour l'astuce, ça a résolu mon bug !",
            date: new Date("2023-10-18T16:22:00Z"),
            comments: [],
            userStatus: "online"
        },
        {
            message_id: "msg_010",
            id_user: "user_02",
            forum_id: "forum_annonces",
            title: "Maintenance prévue ce week-end",
            text: "Le serveur sera indisponible dimanche entre 2h et 4h du matin.",
            date: new Date("2023-10-20T14:00:00Z"),
            comments: [],
            userStatus: "offline"
        }
    ]


    const messCollection = await client.db(dbName).collection("messages");
    await messCollection.insertMany(listMessage);
}


async function dellTestData(client, dbName, collectionName) {
    
}


async function main() {
    const uri = "mongodb://localhost";
    const client = new MongoClient(uri);

    try {
        await client.connect();

        await fillDB(client, "projetDB", "testing");

    } catch(e) {
        console.log(e);
    } finally {
        await client.close();
    }
}


main().catch(console.error);