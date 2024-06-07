// server/controller/messageController.js

const express = require('express');
const router = express.Router();
const send_message = require('../apis/send_message');

router.post('/send-message', async (req, res) => {
    const { waktu, nilai } = req.body;
    try {
        await send_message(waktu, nilai);
        res.status(200).json({ message: 'Message sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
