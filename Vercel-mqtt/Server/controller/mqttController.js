const mqtt = require('mqtt');
const mongoose = require('mongoose');
const { DataValue } = require('../model/data');
require('dotenv').config();

// Connect to MQTT broker
const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

client.on('connect', () => {
    console.log('MQTT client connected');
    client.subscribe(['skripsi/byhendrich/dashtoesp', 'skripsi/byhendrich/esptodash'], { qos: 0 }, (error) => {
        if (error) {
            console.log('Subscription error:', error);
        } else {
            console.log('Subscribed to skripsi/byhendrich/dashtoesp and skripsi/byhendrich/esptodash');
        }
    });
});

client.on('message', async(topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        let newEntry;

        if (topic === 'skripsi/byhendrich/dashtoesp') {
            const { Unit, Setpoint, Samples } = data;
            newEntry = new DataValue({
                waktu: new Date().toISOString(),
                nilai: [{
                    Unit: Unit,
                    Setpoint: Setpoint,
                    Sampling: Samples,
                }]
            });
        } else if (topic === 'skripsi/byhendrich/esptodash') {
            const { Unit, Setpoint, Samples, Temperature, DutyCycle } = data;
            newEntry = new DataValue({
                waktu: new Date().toISOString(),
                nilai: [{
                    Temperature: Temperature,
                    Unit: Unit,
                    Setpoint: Setpoint,
                    Sampling: Samples,
                    DutyCycle: DutyCycle
                }]
            });
        }

        if (newEntry) {
            await newEntry.save();
            console.log('Data saved:', newEntry);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

async function publishPesan(req, res) {
    try {
        const { tanggal, value_array } = req.body;
        const structuredData = value_array.map(item => ({
            Temperature: item.Temperature,
            Unit: item.Unit,
            Setpoint: item.Setpoint,
            Sampling: item.Sampling,
            DutyCycle: item.DutyCycle,
        }));

        // Insert data into MongoDB
        const coba_upload = await DataValue.create({ waktu: tanggal, nilai: structuredData });
        console.log(coba_upload);
        res.json(coba_upload);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while publishing data.' });
    }
}

async function getPesan(req, res) {
    try {
        client.subscribe('skripsi/byhendrich/esptodash', { qos: 0 }, (error) => {
            if (error) {
                return res.status(500).json({ error: 'Subscription failed.' });
            }
        });

        client.once('message', (topic, message) => {
            if (topic === 'skripsi/byhendrich/esptodash') {
                console.log(`Getting message from ${topic} with pesan: ${message}`);
                res.json({ feedback: message.toString() });
            }
        });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'An error occurred while getting messages.' });
    }
}

module.exports = { getPesan, publishPesan };