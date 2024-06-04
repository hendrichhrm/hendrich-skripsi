const mqtt = require('mqtt');
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const connectToMongoDB = require('./mongo'); // Import koneksi MongoDB

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const mqttBroker = 'mqtt://broker.hivemq.com';
const mqttTopic = 'skripsi/byhendrich/esptodash';

// Koneksi ke MQTT Broker
const client = mqtt.connect(mqttBroker);

// Menangani koneksi ke MQTT Broker
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    // Subscribe ke topik MQTT
    client.subscribe(mqttTopic);
});

// Menangani pesan yang diterima dari MQTT Broker
client.on('message', async(topic, message) => {
    const data = JSON.parse(message.toString());
    try {
        const dbClient = await connectToMongoDB();
        const db = dbClient.db('project-hendrich');
        const collection = db.collection('<nama_koleksi>');
        await collection.insertOne(data);
        console.log('Data inserted into MongoDB:', data);
    } catch (err) {
        console.error('Error inserting data into MongoDB:', err);
    }
});

// Mengirimkan file HTML ke client
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Menangani koneksi socket.io dari client
io.on('connection', (socket) => {
    console.log('Client connected');
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});