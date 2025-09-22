
// src/routes/informe.routes.js
// Importar dependencias
import express from 'express';
import {
  generarInformePDF,
  generarInformePorFicha,
  generarInformePorAprendiz,
  obtenerResumenEstadisticas,
  generarInformeInstitucional,
  obtenerInformeFichaPreview,   // 👈 NUEVO: preview JSON para el modal
} from '../controllers/informe.controller.js';

import verificarToken from '../middlewares/authMiddleware.js'; // Middleware de autenticación
import autorizarRoles from '../middlewares/autorizarRol.js';   // Middleware de control por roles

const router = express.Router();

// ─────────────────────────────────────────────────────────────
// 👀 Ping (sanity check)
router.get('/ping', (req, res) => {
  console.log('[informe.routes] /api/informes/ping HIT');
  res.json({ ok: true, scope: 'informe.routes' });
});

// ─────────────────────────────────────────────────────────────
// ✅ Políticas de acceso (ajústalas si lo necesitas)
// - Rol 1 (Instructor) y Rol 2 (Coordinador) y Rol 3 (Administrador/Coordinador) pueden ver informes por ficha y aprendiz
// - Solo Rol 1 puede acceder al PDF general y al resumen de estadísticas (como tenías)
// - El institucional solo Rol 3
// Nota: Si durante pruebas te da 403, agrega tu rol al listado correspondiente.

//
// 📄 Generar informe general en PDF (solo Instructor)
router.get(
  '/pdf',
  verificarToken,
  autorizarRoles(1),
  generarInformePDF
);

//
// 📊 Resumen de estadísticas institucionales (solo Instructor)
router.get(
  '/estadisticas/resumen',
  verificarToken,
  autorizarRoles(1),
  obtenerResumenEstadisticas
);

//
// 📘 Informe por ficha (Instructor/Coordinador/Administrador)
router.get(
  '/ficha/:id',
  verificarToken,
  autorizarRoles(1, 2, 3),
  generarInformePorFicha
);

//
// 🔎 Preview JSON por ficha para el modal (Instructor/Coordinador/Administrador)
router.get(
  '/ficha/:id/preview',
  verificarToken,
  autorizarRoles(1, 2, 3),
  obtenerInformeFichaPreview
);

//
// 👤 Informe por aprendiz (Instructor/Coordinador/Administrador)
router.get(
  '/aprendiz/:id',
  verificarToken,
  autorizarRoles(1, 2, 3),
  generarInformePorAprendiz
);

//
// 🏫 Informe institucional (solo Rol 3)
router.get(
  '/institucional/asistencia',
  verificarToken,
  autorizarRoles(3),
  generarInformeInstitucional
);

// ─────────────────────────────────────────────────────────────
// 🔁 Alias de compatibilidad (por si el front alguna vez llamó las rutas antiguas)
router.get(
  '/reportes/asistencia/:id',
  verificarToken,
  autorizarRoles(1, 2, 3),
  generarInformePorFicha
);
router.get(
  '/reportes/asistencia/:id/preview',
  verificarToken,
  autorizarRoles(1, 2, 3),
  obtenerInformeFichaPreview
);

export default router;
