const send_message = async(waktu, nilai) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                tanggal: waktu,
                value_array: nilai
            })
        }
        const response = await fetch('https://hendrich-project.com/calibration', options);
        if (!response.ok) {
            throw new Error(`Error in uploading to database`);
        }
    } catch (error) {
        console.log(error);
    }
}

export default send_message