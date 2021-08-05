const cors = require('cors');
const express = require('express');
const app = express();
const parser = require('body-parser');

app.use(parser.json());
app.use(cors());

const MongoClient = require('mongodb').MongoClient;
const createRouter = require('./helpers/create_router.js');

MongoClient.connect('mongodb://localhost:27017')
    .then((client) => {
        const db = client.db('pokemon_team');
        const pokemonCollection = db.collection('pokemon');
        const pokemonRouter = createRouter(pokemonCollection);
        app.use('/api/pokemon', pokemonRouter);
    })
    .catch(console.err);

app.listen(3000, function (){
    console.log(`Listening on port ${ this.address().port}`);
});