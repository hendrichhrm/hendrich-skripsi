const mqtt = require('mqtt');
const { data_value } = require('../model/data');
require('dotenv').config();
// const mqtt = require('async-mqtt')
// import mqtt from 'async-mqtt';
const option = {
    username: 'burjoy',
    password: "Tester123456"
}
const client = mqtt.connect(process.env.LINK_MOCK_MQTT, option);
client.on('connect', () => {
    console.log('MQTT client connected');
})

async function publishPesan(req, res) {
    try {
        const { tanggal, array_nilai } = req.body;
        console.log(array_nilai);
        const coba_upload = await data_value.insertMany({ 'waktu': tanggal, 'nilai': array_nilai });
        console.log(coba_upload);
        // const hasil = res.json("Success");
        res.json(coba_upload);
        // console.log(hasil);
    } catch (error) {
        console.log(error);
        res.json(error);
    }
}

async function getPesan(req, res) {
    try {
        // const {topik} = req.body;
        // client.publish('test', "Cek 1-2-3");
        // let pesan;
        const result = client.subscribe('test', { qos: 0 }, (error) => {
            if (error) {
                res.json(error);
            } else {
                client.on('message', (topic, message) => {
                        console.log(`Getting message from ${topic} with pesan: ${message}`);
                        client.end();
                        // pesan = message;
                        // res.json({"feedback": message});
                        return message;
                    })
                    // res.json({"feedback": pesan});
                    // res.json(topik);
            }
        });
        // console.log(result);
    } catch (error) {
        console.log(error);
    }
}

module.exports = { getPesan, publishPesan }