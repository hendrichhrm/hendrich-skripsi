const express = require('express');
const mqtt = require('mqtt');
const { MongoClient, ServerApiVersion } = require('mongodb');

const app = express();
const port = 8884;

const mqttBroker = 'mqtt://broker.hivemq.com';
const topic_esptodash = 'skripsi/byhendrich/esptodash';

const uri = "mongodb+srv://hendrich_mogodb:Admin_project1@project-hendrich.as89plx.mongodb.net/?retryWrites=true&w=majority&appName=project-hendrich";
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

let db;

// Fungsi untuk koneksi ke MongoDB
async function connectToMongoDB() {
    try {
        await client.connect();
        db = client.db('project-hendrich');
        console.log("Connected to MongoDB!");
    } catch (err) {
        console.error('Failed to connect to MongoDB:', err);
        process.exit(1);
    }
}

// Koneksi ke MQTT Broker
const mqttClient = mqtt.connect(mqttBroker);

mqttClient.on('connect', () => {
    console.log('Connected to MQTT broker');
    mqttClient.subscribe(topic_esptodash, (err) => {
        if (err) {
            console.error('Failed to subscribe to topic:', topic_esptodash);
        } else {
            console.log('Subscribed to topic:', topic_esptodash);
        }
    });
});

// Menangani pesan yang diterima dari MQTT Broker
mqttClient.on('message', async(topic, message) => {
    const data = JSON.parse(message.toString());
    try {
        const collection = db.collection('data_drywell');
        await collection.insertOne(data);
        console.log('Data inserted into MongoDB:', data);
    } catch (err) {
        console.error('Error inserting data into MongoDB:', err);
    }
    console.log(`topic: ${topic} sends : ${message.toString()}`);
});

// Mengirimkan file HTML ke client
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Middleware untuk parsing JSON
app.use(express.json());

// Endpoint untuk mempublikasikan pesan ke MQTT
app.post('/publish', (req, res) => {
    const { message } = req.body;

    if (!message) {
        return res.status(400).send('Message is required');
    }

    mqttClient.publish(topic_esptodash, message, (err) => {
        if (err) {
            return res.status(500).send('Failed to publish message');
        }

        res.status(200).send('Message published successfully');
    });
});

// Mulai server dan koneksi ke MongoDB
app.listen(port, async() => {
    await connectToMongoDB();
    console.log(`Server is running on port ${port}`);
});
