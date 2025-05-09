const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint POST para enviar notificación
app.post('/send', async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    const message = {
        token,
        notification: {
            title,
            body
        }
    };

    try {
        const response = await admin.messaging().send(message);
        res.json({ success: true, response });
    } catch (error) {
        console.error('Error al enviar:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor en http://localhost:${PORT}`);
});
