const express = require("express");
const app = express();

const PORT = 3001;

app.use('/', (req, res) => {
    res.send('test');
})

app.listen(PORT, () => { console.log("Serveur OK ! - port : " + PORT); })