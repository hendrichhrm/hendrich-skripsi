const send_message = async(waktu, nilai) => {
    try {
        const options = {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tanggal: waktu,
                value_array: nilai
            })
        };
        const response = await fetch('http://localhost:3000/insert', options);
        if (!response.ok) {
            throw new Error(`Error in uploading to database`);
        }
    } catch (error) {
        console.log(error);
    }
};

export default send_message