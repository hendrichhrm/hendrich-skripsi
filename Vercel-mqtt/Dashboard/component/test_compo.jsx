import React, { useEffect, useState } from 'react';
import mqtt from 'mqtt';
import send_message from '../../../server/apis/sendMessage';

const TestCompo = () => {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);
    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    useEffect(() => {
        client.on('connect', () => {
            console.log('Connected to broker');
            setConnected(true);
        });

        client.subscribe('test', { qos: 2 }, (error) => {
            if (error) {
                console.error('Subscription error:', error);
            }
        });

        client.on('message', (topic, message) => {
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            setMessages((prevMessages) => [...prevMessages, message.toString()]);
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
        });

    }, []);
    console.log(messages);
    if (messages.at(-1) == "Testing MQTT connection") {
        const time = new Date().toLocaleString();
        send_message(time, messages);
    }

    return (
        <div>
        <h1> {connected} </h1> 
            <h1> MQTT Messages </h1> 
            <ul>{
            messages.map((msg, index) => (<li key={index}>{msg} </li>))
            } 
                </ul> 
            </div>
    );
};

export default TestCompo;
