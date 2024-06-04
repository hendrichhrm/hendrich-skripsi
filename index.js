const express = require('express');
const mqtt = require('mqtt');

const app = express();
const port = 8884;

// Konfigurasi MQTT
const mqttBrokerUrl = 'mqtt://broker.hivemq.com';
const mqttOptions = {
  username: 'hendrich@hivemq',
  password: 'Admin_project1',
  protocol: 'mqtts'
};
const topic_dashtoesp = 'skripsi/byhendrich/dashtoesp';
const topic_esptodash = 'skripsi/byhendrich/esptodash';

// Membuat client MQTT
const client = mqtt.connect(mqttBrokerUrl, mqttOptions);

// Event handler untuk koneksi MQTT
client.on('connect', () => {
  console.log('Connected to MQTT broker');
  client.subscribe(topic_dashtoesp, (err) => {
    if (err) {
      console.error('Failed to subscribe to topic:', topic_dashtoesp);
    } else {
      console.log('Subscribed to topic:', topic_dashtoesp);
    }
  });
});

// Event handler untuk pesan MQTT
client.on('message', (topic, message) => {
  console.log(`Received message: ${message.toString()} on topic: ${topic}`);
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

// Memulai server Express
app.listen(port, () => {
  console.log(`Express server listening on port ${port}`);
});
