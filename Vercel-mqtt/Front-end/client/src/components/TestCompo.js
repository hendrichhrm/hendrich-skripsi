import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';

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
                sendMessage(time, message.toString());
            }
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            client.end();
        };
    }, []);

    const sendMessage = async (time, message) => {
        try {
            const response = await fetch('/api/send-message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    waktu: time,
                    nilai: [message],
                }),
            });
            if (!response.ok) {
                throw new Error(`Error in uploading to database`);
            }
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

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
