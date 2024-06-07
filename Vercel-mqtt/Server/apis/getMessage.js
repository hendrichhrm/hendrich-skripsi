const get_message = async() => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-type': 'application/json'
            },
        }
        const response = await fetch('https://hendrich-project.com/data-logging');
        if (!response.ok) {
            throw new Error(`Error in setting the MQTT, error:${response.status}`);
        }
        return "Success"
    } catch (error) {
        console.log(error);
    }
}

export default get_message