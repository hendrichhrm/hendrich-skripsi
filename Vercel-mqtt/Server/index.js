const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const mqttController = require('./controller/mqttController');
const messageController = require('./controller/messageController');
require('dotenv').config();

const app = express();

const mongoUri = process.env.MONGODB_URI;
const port = process.env.PORT || 3000;
const host = process.env.HOST || '0.0.0.0';

console.log('MongoDB URI:', mongoUri);

mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log('Connected to MongoDB');
}).catch((err) => {
    console.error(`Failed to connect to MongoDB: ${err}`);
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Log incoming requests
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

app.post('/skripsi/byhendrich/dashtoesp', (req, res) => {
    mqttController.publishPesan(req, res).catch((err) => {
        console.error('Error in /skripsi/byhendrich/dashtoesp:', err);
        res.status(500).send('Internal Server Error');
    });
});

app.get('/skripsi/byhendrich/esptodash', (req, res) => {
    mqttController.getPesan(req, res).catch((err) => {
        console.error('Error in /skripsi/byhendrich/esptodash:', err);
        res.status(500).send('Internal Server Error');
    });
});

app.use('/api', (req, res, next) => {
    messageController(req, res, next).catch((err) => {
        console.error('Error in /api:', err);
        res.status(500).send('Internal Server Error');
    });
});

app.listen(port, host, () => {
    console.log(`App running on http://${host}:${port}`);
});
