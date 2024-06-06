const mqtt = require('mqtt');
const mongoose = require('mongoose');
const { data_value } = require('../model/data');
require('dotenv').config();

// Connect to MQTT broker
const client = mqtt.connect("wss://broker.hivemq.com:8884/mqtt");

client.on('connect', () => {
    console.log('MQTT client connected');
});

async function publishPesan(req, res) {
    try {
        const { tanggal, value_array } = req.body;
        console.log(value_array);
        console.log(tanggal);

        // Validate and structure the data
        const structuredData = value_array.map(item => ({
            Temperature: item.Temperature,
            Unit: item.Unit,
            Setpoint: item.Setpoint,
            Sampling: item.Sampling,
            DutyCycle: item.DutyCycle,
        }));

        const coba_upload = await data_value.insertMany({ 'waktu': tanggal, 'nilai': value_array });
        console.log(coba_upload);
        res.json(coba_upload);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

async function getPesan(req, res) {
    try {
        client.subscribe('test', { qos: 0 }, (error) => {
            if (error) {
                res.json(error);
            } else {
                client.on('message', (topic, message) => {
                    console.log(`Getting message from ${topic} with pesan: ${message}`);
                    res.json({ feedback: message.toString() });
                });
            }
        });
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

module.exports = { getPesan, publishPesan };
