const express = require('express');
const path = require('path');
const { MongoClient } = require('mongodb');
const app = express();

// Configuración
const PORT = 3000;
const MONGO_URL = 'mongodb://localhost:27017';
const DB_NAME = 'formularioDB';

// Middleware
app.use(express.static(path.join(__dirname, 'paginaweb'))); // ¡Asegúrate de que la carpeta existe!
app.use(express.json());

// Conexión a MongoDB
let db;
let mongoClient;

(async () => {
  try {
    mongoClient = await MongoClient.connect(MONGO_URL);
    db = mongoClient.db(DB_NAME);
    console.log('MongoDB conectado');
  } catch (err) {
    console.error('Error de MongoDB:', err);
    process.exit(1); // Detiene la app si no hay conexión a DB
  }
})();

// Middleware para verificar DB
app.use((req, res, next) => {
  if (!db) return res.status(503).json({ error: 'Base de datos no disponible' });
  next();
});

// Rutas
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'paginaweb', 'index.html'));
});

app.post('/api/guardar', async (req, res) => {
  try {
    await db.collection('registros').insertOne({
      ...req.body,
      fecha: new Date()
    });
    res.json({ mensaje: 'Datos guardados exitosamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener IP de red confiable
function getNetworkIp() {
  const interfaces = require('os').networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const net of interfaces[name]) {
      if (net.family === 'IPv4' && !net.internal) {
        return net.address;
      }
    }
  }
  return 'IP';
}

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor funcionando en:`);
  console.log(`- Local: http://localhost:${PORT}`);
  console.log(`- Red: http://${getNetworkIp()}:${PORT}`);
});
