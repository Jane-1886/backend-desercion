
// src/server.js
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

// -------------------------------
// CORS (permite Vite y Authorization, incluye PATCH)
// -------------------------------
const FRONT_ORIGIN = process.env.FRONT_ORIGIN || 'http://localhost:5173';

const corsOptions = {
  origin: FRONT_ORIGIN,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'], // ✅ incluye PATCH
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: false,        // JWT por header, no cookies
  optionsSuccessStatus: 204, // respuesta al preflight
};

// Middleware CORS para todas las rutas
app.use(cors(corsOptions));

// PRE-FLIGHT manual (evita usar `app.options('*', ...)`, que rompe en Express 5)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', FRONT_ORIGIN);
  res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  if (req.method === 'OPTIONS') {
    return res.sendStatus(204); // responde preflight sin pasar al router
  }
  next();
});

// -------------------------------
// Middlewares globales
// -------------------------------
app.use(express.json({ limit: '2mb' }));

// -------------------------------
// Importación de rutas
// -------------------------------
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
import informeRoutes from './routes/informe.routes.js';      // GET /ficha/:id y /ficha/:id/preview
import estadisticasRoutes from './routes/estadisticas.routes.js';
import rolesRoutes from './routes/roles.routes.js';

// -------------------------------
// Registro de rutas con sus prefijos
// -------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuarios/estado', estadoUsuarioRoutes);

// 👇 El front llama PATCH /api/fichas/:id/estado
app.use('/api/fichas', fichaRoutes);

// (Opcional) CRUD separado de estados (no dupliques semántica con la anterior)
app.use('/api/fichas/estado', estadoFichaRoutes);
app.use('/api/estados-fichas', estadoFichaRoutes);     // (Opcional)
app.use('/api/estados-usuarios', estadoUsuarioRoutes); // (Opcional)

app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/planes', planSeguimientoRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/intervenciones', intervencionRoutes);
app.use('/api/aprendices', aprendizRoutes);

// 👇 Para Reportes
app.use('/api/informes', informeRoutes);

app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/roles', rolesRoutes);

// -------------------------------
// Rutas utilitarias
// -------------------------------
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
});

app.get('/', (req, res) => {
  res.send('✅ ¡Hola Janeth! Tu backend está funcionando 🎉');
});

// 404 final
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Manejador centralizado de errores
app.use((err, req, res, next) => {
  console.error('💥 Error no controlado:', err);
  res.status(err.status || 500).json({
    mensaje: err.message || 'Error interno del servidor',
  });
});

// -------------------------------
// Verificar conexión a la base de datos e iniciar servidor
// -------------------------------
const probarConexion = async () => {
  try {
    await db.getConnection();
    console.log('✅ Conexión a MySQL exitosa');
  } catch (error) {
    console.error('❌ Error al conectar a la base de datos:', error.message);
  }
};

await probarConexion();

app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
  console.log(`🌐 CORS permitido para: ${FRONT_ORIGIN}`);
});
