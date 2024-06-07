const mqtt = require('mqtt');
const express = require('express');
const app = express();
const cors = require('cors');
const mqtt_controller = require('./controller/mqttController');
const mongoose = require('mongoose');

require('dotenv').config();

const mongoUri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;

console.log('MongoDB URI:', mongoUri);

mongoose.connect(mongoUri)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error(`Failed to connect to MongoDB: ${err}`);
    })

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/skripsi/byhendrich/dashtoesp", mqtt_controller.publishPesan);
app.get("/skripsi/byhendrich/esptodash", mqtt_controller.getPesan);

app.listen(3000, function() {
    console.log("app running on this");
});