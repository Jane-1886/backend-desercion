
import express from 'express';
import {
  obtenerNotificaciones,        // coord: lista todo (con paginación opcional)
  obtenerNotificacionPorId,     // coord/autor del item
  crearNotificacion,            // bienestar (2)
  actualizarNotificacion,       // coord (3) o autor del item si permites edición
  eliminarNotificacion          // coord (3)
} from '../controllers/notificacion.controller.js';

import verificarToken from '../middlewares/authMiddleware.js';
import autorizarRoles from '../middlewares/autorizarRol.js';

const router = express.Router();

// ---- Listar ----
// Coordinación ve todo
router.get('/', verificarToken, autorizarRoles(3), obtenerNotificaciones);

// Opcional: Bienestar ve solo las suyas
router.get('/mias', verificarToken, autorizarRoles(2), (req, res, next) => {
  // Reutiliza obtenerNotificaciones pero con un flag en req para filtrar por req.usuario.id
  req.soloDelUsuario = true;
  return obtenerNotificaciones(req, res, next);
});

// Ver una por id (coord o autor)
router.get('/:id', verificarToken, autorizarRoles(2,3), obtenerNotificacionPorId);

// ---- Crear (solo bienestar) ----
router.post('/', verificarToken, autorizarRoles(2), crearNotificacion);

// ---- Actualizar (solo coord) -> usa PATCH para estado/observación ----
router.patch('/:id', verificarToken, autorizarRoles(3), actualizarNotificacion);

// ---- Eliminar (solo coord) ----
router.delete('/:id', verificarToken, autorizarRoles(3), eliminarNotificacion);

export default router;
