
// Importaciones principales
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';

// Cargar variables de entorno
dotenv.config();
console.log('📌 Iniciando servidor...');

// Inicializar app
const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares globales
app.use(cors()); // Permitir solicitudes desde el frontend
app.use(express.json()); // Permitir recibir JSON

// Importación de rutas
import authRoutes from './routes/auth.routes.js';
import usuarioRoutes from './routes/usuario.routes.js';
import intervencionRoutes from './routes/intervencion.routes.js';
import alertaRoutes from './routes/alerta.routes.js';
import asistenciaRoutes from './routes/asistencia.routes.js';
import planSeguimientoRoutes from './routes/planSeguimiento.routes.js';
import notificacionRoutes from './routes/notificacion.routes.js';
import estadoUsuarioRoutes from './routes/estadoUsuario.routes.js';
import estadoFichaRoutes from './routes/estadoFicha.routes.js';
import fichaRoutes from './routes/ficha.routes.js';
import aprendizRoutes from './routes/aprendiz.routes.js';
import informeRoutes from './routes/informe.routes.js';
import estadisticasRoutes from './routes/estadisticas.routes.js';

// Registrar rutas con sus prefijos
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuarios/estado', estadoUsuarioRoutes);
app.use('/api/fichas', fichaRoutes);
app.use('/api/fichas/estado', estadoFichaRoutes);
app.use('/api/estados-fichas', estadoFichaRoutes); // Opcional: puedes eliminar si no se usa
app.use('/api/estados-usuarios', estadoUsuarioRoutes); // Opcional: puedes eliminar si no se usa
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/planes', planSeguimientoRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/intervenciones', intervencionRoutes);
app.use('/api/aprendices', aprendizRoutes);
app.use('/api/informes', informeRoutes); // 👈 esta es la nueva
app.use('/api/estadisticas', estadisticasRoutes); // 👈 nuevas estadísticas

// Ruta raíz de prueba
app.get('/', (req, res) => {
  res.send('✅ ¡Hola Janeth! Tu backend está funcionando 🎉');
});

// Verificar conexión a la base de datos
const probarConexion = async () => {
  try {
    await db.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
};

probarConexion();

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});
