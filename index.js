const mqtt = require('mqtt');

const option = {
    username: 'hendrich@hivemq',
    password: "Admin_project1"
}
const client = mqtt.connect('wss://f8d608e5d3dc4565972bf7beacf0e4da.s2.eu.hivemq.cloud:8884/mqtt', option);
client.on('connect', () => {
    client.publish('skripsi/byhendrich/subscribe', 'Hello, HiveMQ!', (err) => {
        if (err) {
          console.error('Error publishing message:', err);
        } else {
          console.log('Message published successfully');
        }
    });
})
  
client.subscribe('skripsi/byhendrich/publish', (err, response) => {
    if (err) {
      console.error('Error subscribing to topic:', err);
    } else {
      console.log('Subscribed to topic successfully');
    //   console.log(response);
    }
});

client.on('message', (topic, message) => {
    console.log(Received message on topic ${topic}: ${message});
});

// client.on("connect", () => {
//     client.subscribe("presence", (err) => {
//       if (!err) {
//         client.publish("presence", "Hello mqtt");
//       }
//     });
//   });
  
// client.on("message", (topic, message) => {
//     // message is Buffer
//     console.log(message.toString());
//     client.end();
//   });
