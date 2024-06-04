const { MongoClient } = require('mongodb');

const uri = 'mongodb+srv://hendrich_mongodb:Admin_project1@project-hendrich/.as89plx.mongodb.net/?retryWrites=true&w=majority&appName=project-hendrich';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToMongoDB() {
    try {
        await client.connect();
        console.log('Connected to MongoDB');
        return client;
    } catch (err) {
        console.error('Error connecting to MongoDB:', err);
    }
}

module.exports = connectToMongoDB;