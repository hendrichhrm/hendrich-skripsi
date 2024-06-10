import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import './Dataview.css';

const Dataview = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');
        client.on('connect', () => {
            console.log('Connected to broker');
            client.subscribe('skripsi/byhendrich/esptodash', { qos: 2 }, (error) => {
                if (error) {
                    console.error('Subscription error:', error);
                }
            });
        });

        client.on('message', (topic, message) => {
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            if (topic === 'skripsi/byhendrich/esptodash') {
                const parsedMessage = JSON.parse(message.toString());
                setData((prevData) => [...prevData, parsedMessage]);
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
        <div className="container">
            <h1>Data View</h1>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th scope="col">Unit (c / f)</th>
                        <th scope="col">Setpoint</th>
                        <th scope="col">Sampling</th>
                        <th scope="col">Duty Cycle</th>
                        <th scope="col">Temperature</th>
                    </tr>
                </thead>
                <tbody>
                    {data.map((item, index) => (
                        <tr key={index}>               
                            <td>{item.Unit}</td>
                            <td>{item.Setpoint}</td>
                            <td>{item.Sampling}</td>
                            <td>{item.Dutycycle}</td>
                            <td>{item.Temperature}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <button onClick={() => window.location.href = "/"}>Back to Control Panel</button>
        </div>
    );
};

export default Dataview;
