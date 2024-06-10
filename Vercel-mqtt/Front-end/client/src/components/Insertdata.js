import React, { useState, useEffect } from 'react';
import mqtt from 'mqtt';
import axios from 'axios';
import './Insertdata.css';

const Insertdata = () => {
    const [temperatureUnit, setTemperatureUnit] = useState('');
    const [desiredTemperature, setDesiredTemperature] = useState('');
    const [samplesInSeconds, setSamplesInSeconds] = useState('');
    const [popupMessage, setPopupMessage] = useState('');
    const [popupVisible, setPopupVisible] = useState(false);

    const client = mqtt.connect('wss://broker.hivemq.com:8884/mqtt');

    useEffect(() => {
        client.on('connect', () => {
            console.log('Connected to broker');
            client.subscribe(['skripsi/byhendrich/dashtoesp', 'skripsi/byhendrich/esptodash'], { qos: 2 }, (error) => {
                if (error) {
                    console.error('Subscription error:', error);
                }
            });
        });

        client.on('message', (topic, message) => {
            console.log(`Received message on topic ${topic}: ${message.toString()}`);
            if (topic === 'skripsi/byhendrich/dashtoesp' && message.toString() === "Testing MQTT connection") {
                const time = new Date().toLocaleString();
                setPopupMessage(`Message received at ${time}`);
                setPopupVisible(true);
                setTimeout(() => setPopupVisible(false), 3000);
            }
        });

        client.on('error', (error) => {
            console.error('Connection error:', error);
            setPopupMessage('Connection error');
            setPopupVisible(true);
            setTimeout(() => setPopupVisible(false), 3000);
        });

        return () => {
            client.end();
        };
    }, [client]);

    const handleSendClick = () => {
        if (temperatureUnit.toLowerCase() !== 'c' && temperatureUnit.toLowerCase() !== 'f') {
            setPopupMessage('Temperature unit must be either "c" or "f".');
            setPopupVisible(true);
            setTimeout(() => setPopupVisible(false), 3000);
            return;
        }

        const data = {
            Temperature: desiredTemperature,
            Unit: temperatureUnit,
            Setpoint: desiredTemperature,
            Sampling: samplesInSeconds,
            DutyCycle: '0' // assuming duty cycle is calculated elsewhere or set to 0 for now
        };

        console.log("Data to be sent:", data);

        const message = JSON.stringify(data);
        console.log("Sending data:", message);
        client.publish('skripsi/byhendrich/dashtoesp', message);

        // Save data to MongoDB through backend API
        axios.post('http://localhost:3000/', { waktu: new Date().toISOString(), nilai: [data] })
            .then(response => {
                console.log("Response from server:", response.data);
                setPopupMessage('Data successfully sent and saved');
                setPopupVisible(true);
                setTimeout(() => setPopupVisible(false), 3000);
            })
            .catch(error => {
                console.error("Error from server:", error);
                setPopupMessage('Error saving data to database');
                setPopupVisible(true);
                setTimeout(() => setPopupVisible(false), 3000);
            });
    };

    return (
        <div className="container">
            <h1>MQTT Control Panel</h1>
            <div>
                <label htmlFor="Temperature-unit">Temperature Unit (c / f)</label>
                <input
                    type="text"
                    id="Temperature-unit"
                    placeholder="c/f"
                    value={temperatureUnit}
                    onChange={(e) => {
                        const value = e.target.value.toLowerCase();
                        if (value === 'c' || value === 'f' || value === '') {
                            setTemperatureUnit(e.target.value);
                        }
                    }}
                />
            </div>
            <div>
                <label htmlFor="Desired-temperature">Desired Temperature (25 - 600)</label>
                <input
                    type="number"
                    id="Desired-temperature"
                    placeholder="setpoint"
                    name="desired-temperature"
                    min="25"
                    max="600"
                    value={desiredTemperature}
                    onChange={(e) => setDesiredTemperature(e.target.value)}
                    onBlur={(e) => {
                        if (e.target.value < 25) setDesiredTemperature(25);
                        if (e.target.value > 600) setDesiredTemperature(600);
                    }}
                />
            </div>
            <div>
                <label htmlFor="Samples-in-seconds">Samples (10 - 999)</label>
                <input
                    type="number"
                    id="Samples-in-seconds"
                    placeholder="in seconds"
                    name="samples-in-seconds"
                    min="10"
                    max="999"
                    value={samplesInSeconds}
                    onChange={(e) => setSamplesInSeconds(e.target.value)}
                    onBlur={(e) => {
                        if (e.target.value < 10) setSamplesInSeconds(10);
                        if (e.target.value > 999) setSamplesInSeconds(999);
                    }}
                />
            </div>
            <button onClick={handleSendClick}>Start</button>
            <button onClick={() => window.location.href = "/data"}>View Data</button>

            {popupVisible && <div className="popup">{popupMessage}</div>}
        </div>
    );
};

export default Insertdata;
