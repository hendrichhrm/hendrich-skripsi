const mqtt = require('mqtt');

class MqttHandler {
    constructor(host, username, password) {
        this.host = host;
        this.username = username; // mqtt credentials if these are needed to connect
        this.password = password;
        this.mqttClient = null;
    }

    connect() {
        // Connect mqtt with credentials (in case of needed, otherwise we can omit 2nd param)
        this.mqttClient = mqtt.connect(this.host, { username: this.username, password: this.password });

        // Mqtt error calback
        this.mqttClient.on('error', (err) => {
            console.log(err);
            console.error(err);
            // return err
            //   this.mqttClient.end();
        });

        // Connection callback
        this.mqttClient.on('connect', () => {
            console.log(`mqtt client connected`);
        });

        // mqtt subscriptions
        this.mqttClient.subscribe('test_topic', { qos: 0 });

        // When a message arrives, console.log it
        this.mqttClient.on('message', function(topic, message) {
            console.log(message.toString());
        });

        // this.mqttClient.on('close', () => {
        //   console.log(`mqtt client disconnected`);
        // });
    }

    // Sends a mqtt message to topic: mytopic
    sendMessage(message, topic) {
        this.mqttClient.publish(topic, message, (err) => {
            if (err) {
                console.error(err);
            } else {
                console.log("Berhasil kirim pesan");
            }
        });
    }

    getMessage(topic) {
        this.mqttClient.subscribe(topic, { qos: 0 });
        this.notifyMessage();
    }

    notifyMessage() {
        this.mqttClient.on('message', (topic, message) => {
            console.log(`Getting message from ${topic} with message ${message}`);
        })
    }
}

module.exports = MqttHandler;