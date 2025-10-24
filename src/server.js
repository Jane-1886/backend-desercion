// src/server.js (rescate mínimo)
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import db from './config/db.js';

dotenv.config();
console.log('📌 Iniciando servidor (rescate CORS)…');

const app = express();
const PORT = process.env.PORT || 3000;

/* ----------------------------------------------------
   CORS: permitir localhost/127.0.0.1 en cualquier puerto
   y dominios definidos en FRONT_ORIGINS (coma-separados)
----------------------------------------------------- */
const envOrigins = (process.env.FRONT_ORIGINS || '')
  .split(',')
  .map(o => o.trim())
  .filter(Boolean);

// Predicados para localhost
const isLocalhost = (origin = '') =>
  /^http:\/\/localhost(?::\d+)?$/.test(origin);

const isLoopback = (origin = '') =>
  /^http:\/\/127\.0\.0\.1(?::\d+)?$/.test(origin);

const allowedByEnv = (origin = '') =>
  envOrigins.includes(origin);

// Siempre añade Vary para evitar cachear por Origin
app.use((req, res, next) => {
  res.header('Vary', 'Origin');
  next();
});

app.use(cors({
  origin: (origin, cb) => {
    // Permite Postman/curl sin Origin
    if (!origin) return cb(null, true);

    const allowed =
      isLocalhost(origin) ||
      isLoopback(origin) ||
      allowedByEnv(origin);

    // Log de diagnóstico: qué origin llega y si se permite
    console.log(`🔎 Origin recibido: ${origin} | allowed=${allowed}`);

    if (allowed) return cb(null, true);
    return cb(new Error(`Origen no permitido por CORS: ${origin}`));
  },
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type','Authorization'],
  credentials: false,
  optionsSuccessStatus: 204
}));

// Body parser
app.use(express.json({ limit: '2mb' }));

/* -----------------------------
   Rutas
------------------------------ */
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
import rolesRoutes from './routes/roles.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/usuarios', usuarioRoutes);
app.use('/api/usuarios/estado', estadoUsuarioRoutes);
app.use('/api/fichas', fichaRoutes);
app.use('/api/fichas/estado', estadoFichaRoutes);
app.use('/api/estados-fichas', estadoFichaRoutes);
app.use('/api/estados-usuarios', estadoUsuarioRoutes);
app.use('/api/notificaciones', notificacionRoutes);
app.use('/api/planes', planSeguimientoRoutes);
app.use('/api/asistencias', asistenciaRoutes);
app.use('/api/alertas', alertaRoutes);
app.use('/api/intervenciones', intervencionRoutes);
app.use('/api/aprendices', aprendizRoutes);
app.use('/api/informes', informeRoutes);
app.use('/api/estadisticas', estadisticasRoutes);
app.use('/api/roles', rolesRoutes);

// Utilitarias
app.get('/api/ping', (req, res) => {
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev' });
});

app.get('/', (req, res) => {
  res.send('✅ Backend arriba (rescate CORS)');
});

// 404
app.use((req, res) => {
  res.status(404).json({ mensaje: 'Ruta no encontrada' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('💥 Error no controlado:', err);
  res.status(err.status || 500).json({ mensaje: err.message || 'Error interno' });
});

// DB y arranque
const probarConexion = async () => {
  try {
    const conn = await db.getConnection();
    await conn.ping();
    conn.release();
    console.log('✅ Conexión a MySQL OK');
  } catch (e) {
    console.error('❌ MySQL:', e.message);
  }
};
await probarConexion();

app.listen(PORT, () => {
  console.log(`🚀 http://localhost:${PORT}`);
  console.log('🌐 Acepta: http://localhost:* y http://127.0.0.1:*');
  if (envOrigins.length) {
    console.log('➕ FRONT_ORIGINS .env:', envOrigins);
  }
});
