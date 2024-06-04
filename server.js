const express = require('express');
const mqtt = require('mqtt');
const cors = require('cors');
const connectToMongoDB = require('./mongo'); // Import koneksi MongoDB

const app = express();
const port = process.env.PORT || 8884;

const mqttBroker = 'mqtt://broker.hivemq.com';
const topic_esptodash = 'skripsi/byhendrich/esptodash';

// Middleware untuk CORS
app.use(cors());

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
        const db = await connectToMongoDB();
        const collection = db.collection('data_sensory');
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

// Endpoint untuk mendapatkan data dari MongoDB
app.get('/data', async(req, res) => {
    try {
        const db = await connectToMongoDB();
        const collection = db.collection('data_sensory');
        const data = await collection.find().sort({ _id: -1 }).limit(100).toArray(); // Dapatkan 100 data terbaru
        res.json(data);
    } catch (err) {
        console.error('Error fetching data from MongoDB:', err);
        res.status(500).send('Error fetching data');
    }
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
    try {
        await connectToMongoDB();
        console.log(`Server is running on port ${port}`);
    } catch (err) {
        console.error('Failed to start server:', err);
    }
});