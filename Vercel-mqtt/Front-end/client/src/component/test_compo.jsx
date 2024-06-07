import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import send_message from '../../../server/apis/send_message';

const TestCompo = () => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    useEffect(() => {
        client.on('connect', () => {
            console.log('Connected to broker');
            setConnected(true);
            client.subscribe(['skripsi/byhendrich/dashtoesp', 'skripsi/byhendrich/esptodash'], { qos: 2 }, (error) => {
                if (error) {
                    console.error('Subscription error:', error);
                }
            });
        });

        client.on('message', (topic, message) => {
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            setMessages((prevMessages) => [...prevMessages, message.toString()]);

            // Handle messages and send to backend if necessary
            if (topic === 'skripsi/byhendrich/dashtoesp' && message.toString() === "Testing MQTT connection") {
                const time = new Date().toLocaleString();
                send_message(time, message.toString());
            }
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            client.end();
        };
    }, []);

    return (
        <div>
            <h1>{connected ? 'Connected to MQTT Broker' : 'Connecting...'}</h1>
            <h1>MQTT Messages</h1>
            <ul>
                {messages.map((msg, index) => (
                    <li key={index}>{msg}</li>
                ))}
            </ul>
        </div>
    );
};

export default TestCompo;
