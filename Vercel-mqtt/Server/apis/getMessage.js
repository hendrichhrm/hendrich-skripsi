const get_message = async() => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        }
        const response = await fetch('http://localhost:3000/skripsi/byhendrich/esptodash');
        if (!response.ok) {
            throw new Error(`Error in setting the MQTT, error:${response.status}`);
        }
        return "Success"
    } catch (error) {
        console.log(error);
    }
}

export default get_message
