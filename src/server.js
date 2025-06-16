import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';
import usuarioRoutes from './routes/usuario.routes.js';
import intervencionRoutes from './routes/intervencion.routes.js';

dotenv.config();

console.log('📌 Iniciando servidor...');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use('/api/intervenciones', intervencionRoutes);

app.use('/api/usuarios', usuarioRoutes);

app.get('/', (req, res) => {
  res.send('✅ ¡Hola Janeth! Tu backend está funcionando 🎉');
});

const probarConexion = async () => {
  try {
    await db.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
};

probarConexion();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});


