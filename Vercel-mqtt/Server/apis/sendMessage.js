const send_message = async(waktu, nilai) => {
    try {
        const options = {
            method: 'POST',
            headers: {
                'Content-type': 'application/json'
            },
            body: JSON.stringify({
                tanggal: waktu,
                array_nilai: nilai
            })
        }
        const response = await fetch('http://localhost:3000/test_publish', options);
        if (!response.ok) {
            throw new Error(`Error in uploading to database`);
        }
    } catch (error) {
        console.log(error);
    }
}

export default send_message