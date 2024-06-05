import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import send_message from '../../../server/apis/sendMessage';

const TestCompo = () => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        const option = {
            username: 'burjoy',
            password: 'Tester123456',
        };

        const client = mqtt.connect('wss://fd463dae44d44830b87a2ab8ad7e97f1.s1.eu.hivemq.cloud:8884/mqtt', option);

        client.on('connect', () => {
            console.log('Connected to broker');
            setConnected(true);
            client.subscribe('test', { qos: 2 }, (error) => {
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
            if (client.connected) {
                client.end();
            }
        };
    }, []);

    useEffect(() => {
        if (messages.length > 0 && messages.at(-1) === 'Testing MQTT connection') {
            const time = new Date().toLocaleString();
            send_message(time, messages);
        }
    }, [messages]);

    return ( <
        div >
        <
        h1 > { connected ? 'Connected' : 'Disconnected' } < /h1> <
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