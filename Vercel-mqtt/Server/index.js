const mqtt = require('mqtt');
const express = require('express');
const app = express();
const cors = require('cors');
//const mqtt_handler = require('./controller/mqttHandler');
const mqtt_controller = require('./controller/mqttController');
const mongoose = require('mongoose');

require('dotenv').config();

mongoose.connect('mongodb+srv://hendrich_mogodb:Admin_project1@project-hendrich.as89plx.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error('Failed to connect to MongoDB : ${err}');
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.post("/skripsi/byhendrich/dashtoesp", mqtt_controller.publishPesan);
app.get("/skripsi/byhendrich/esptodash", mqtt_controller.getPesan);

app.listen(3000, function() {
    console.log("app running on this");
});