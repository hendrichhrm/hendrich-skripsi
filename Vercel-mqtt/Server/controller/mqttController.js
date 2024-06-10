const mqtt = require('mqtt');
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

client.on('message', async (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        console.log(`Received data: ${JSON.stringify(data)} on topic: ${topic}`);
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
                    Unit: Unit,
                    Setpoint: Setpoint,
                    Sampling: Samples,
                    DutyCycle: DutyCycle,
                    Temperature: Temperature
                }]
            });
        }

        if (newEntry) {
            await newEntry.save();
            console.log('Data saved to MongoDB:', newEntry);
        }
    } catch (error) {
        console.error('Error processing message:', error);
    }
});

// Function to publish messages
const publishPesan = (req, res) => {
    const message = JSON.stringify(req.body);
    client.publish('skripsi/byhendrich/dashtoesp', message, {}, (error) => {
        if (error) {
            return res.status(500).send('Failed to publish message');
        }
        res.status(200).send('Message published');
    });
};

// Function to retrieve messages from MongoDB
const getPesan = async (req, res) => {
    try {
        const messages = await DataValue.find();
        res.json(messages);
    } catch (err) {
        res.status(500).send(err.message);
    }
};

module.exports = { publishPesan, getPesan };
