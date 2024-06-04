const express = require('express');
const mqtt = require('mqtt');

const connectToMongoDB = require('./mongo'); // Import koneksi MongoDB

const app = express();
const port = 8884;

const mqttBroker = 'mqtt://broker.hivemq.com';
const topic_esptodash = 'skripsi/byhendrich/esptodash';

// Koneksi ke MQTT Broker
const client = mqtt.connect(mqttBroker);

client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic_esptodash, (err) => {
    if (err) {
      console.error('Failed to subscribe to topic:', topic_esptodash);
    } else {
      console.log('Subscribed to topic:', topic_esptodash);
    }
  });
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

client.on('message', (topic, message) => {
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

  client.publish(topic_esptodash, message, (err) => {
    if (err) {
      return res.status(500).send('Failed to publish message');
    }

    res.status(200).send('Message published successfully');
  });
});
