<script src="https://cdnjs.cloudflare.com/ajax/libs/mqtt/5.7.0/mqtt.min.js"></script>
    <script>
        const mqtt = require('mqtt');
        var brokerUrl = "mqtt://broker.hivemq.com";
        var topic = "skripsi/byhendrich/publish";

        // var client = new Paho.MQTT.Client(brokerUrl, 8000, "web_" + Math.random());
        const client = mqtt.connect(brokerUrl);
        client.subscribe(topic);
        client.on("message", function(message, callback) {
            console.log(message);
            client.end();
        })

        client.onConnectionLost = onConnectionLost;
        client.onMessageArrived = onMessageArrived;

        client.connect({
        onSuccess: onConnect
        useSSL: true
        });

         function onConnect() {
             console.log("Connected to MQTT broker");
             client.subscribe(topic);
         }

         function onConnectionLost(responseObject) {
             if (responseObject.errorCode !== 0) {
                 console.log("Connection lost:", responseObject.errorMessage);
             }
         }

         function onMessageArrived(message) {
             console.log("Message received:", message.payloadString);
             var data = JSON.parse(message.payloadString);
             displayData(data);
         }

         function displayData(data) {
             var tableBody = document.getElementById("mqttData");
             var newRow = tableBody.insertRow();
             var tempCell = newRow.insertCell(0);
             var unitCell = newRow.insertCell(1);
             var setpointCell = newRow.insertCell(2);
             var samplingCell = newRow.insertCell(3);
             var dutycycleCell = newRow.insertCell(4);

             tempCell.appendChild(document.createTextNode(data.Temperature));
             unitCell.appendChild(document.createTextNode(data.Unit));
             setpointCell.appendChild(document.createTextNode(data.setpoint));
             samplingCell.appendChild(document.createTextNode(data.Sampling));
             dutycycleCell.appendChild(document.createTextNode(data.dutycycle));
         }
    </script>
