const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const path = require('path');

// Este archivo lo descargamos directamente de firebase, sin el
// practicamente no funciona el envio de la notificacion
const serviceAccount = require('./firebase-credentials.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Direccion que estamos recibiendo desde el lado del frontend
app.post('/send', async (req, res) => {
    const { token, title, body } = req.body;

    if (!token || !title || !body) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    // Estructura a mandar directamente a la app
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
