const express = require('express');
const app = express();
const port = 3000;
const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

async function main() {
    await client.connect();
    console.log('Connected successfully to MongoDB');
    const db = client.db('formularioDB');
    const collection = db.collection('registros');

    app.get('/', async (req, res) => {
        const docs = await collection.find({}).toArray();
        res.send(docs);
    });

    app.listen(port, () => {
        console.log(`App listening at http://localhost:${port}`);
    });
}

main().catch(console.error);
