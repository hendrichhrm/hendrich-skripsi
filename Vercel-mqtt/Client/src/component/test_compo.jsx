import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import send_message from '../../../server/apis/send_message';

const TestCompo = () => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

        client.on('connect', () => {
            console.log('Connected to broker');
            setConnected(true);
            client.subscribe('skripsi/byhendrich/dashtoesp', { qos: 2 }, (error) => {
                if (error) {
                    console.error('Subscription error:', error);
                }
            });
        });

        client.on('message', (topic, message) => {
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            setMessages((prevMessages) => [...prevMessages, message.toString()]);
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });

        return () => {
            client.end();
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0 && messages.at(-1) === "Testing MQTT connection") {
            const time = new Date().toLocaleString();
            send_message(time, messages);
        }
    }, [messages]);

    return ( <
        div >
        <
        h1 > { connected ? 'Connected to MQTT Broker' : 'Connecting...' } < /h1> <
        h1 > MQTT Messages < /h1> <
        ul > {
            messages.map((msg, index) => ( <
                li key = { index } > { msg } < /li>
            ))
        } <
        /ul> < /
        div >
    );
};

export default TestCompo;