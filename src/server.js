import express from 'express';
import dotenv from 'dotenv';
import db from './config/db.js';

// Importación de rutas
import usuarioRoutes from './routes/usuario.routes.js';
import intervencionRoutes from './routes/intervencion.routes.js';
import alertaRoutes from './routes/alerta.routes.js';
import asistenciaRoutes from './routes/asistencia.routes.js';
import planSeguimientoRoutes from './routes/planSeguimiento.routes.js';
import notificacionRoutes from './routes/notificacion.routes.js';
import estadoUsuarioRoutes from './routes/estadoUsuario.routes.js';
import estadoFichaRoutes from './routes/estadoFicha.routes.js';
import fichaRoutes from './routes/ficha.routes.js';
import authRoutes from './routes/auth.routes.js';
import aprendizRoutes from './routes/aprendiz.routes.js'; // ✅ Asegúrate de tener esto

dotenv.config();
console.log('📌 Iniciando servidor...');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

import cors from 'cors';
app.use(cors());


// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/fichas', fichaRoutes);
app.use('/api/estados-fichas', estadoFichaRoutes);
app.use('/api/estados-usuarios', estadoUsuarioRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/planes', planSeguimientoRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/intervenciones', intervencionRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/aprendices', aprendizRoutes); // ✅ Esta es la que faltaba

// Ruta de prueba
app.get('/', (req, res) => {
  res.send('✅ ¡Hola Janeth! Tu backend está funcionando 🎉');
});

// Probar conexión con la base de datos
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

