const { MongoClient, ServerApiVersion } = require('mongodb');

const uri = "mongodb+srv://hendrich_mogodb:Admin_project1@project-hendrich.as89plx.mongodb.net/?retryWrites=true&w=majority&appName=project-hendrich";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

async function connectToMongoDB() {
    try {
        if (!db) {
            await client.connect();
            db = client.db('project-hendrich');
            console.log("Connected to MongoDB!");
        }
        return db;
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        throw err; // Rethrow the error after logging
    }
}

module.exports = connectToMongoDB;