
// src/routes/ficha.routes.js
import { Router } from "express";
import {
  obtenerFichas,
  obtenerFichaPorId,
  crearFicha,
  actualizarFicha,
  eliminarFicha,
  cambiarEstadoFicha,
  obtenerFichasActivas,
  obtenerFichasInactivas,
} from "../controllers/ficha.controller.js";
import verificarToken from "../middlewares/authMiddleware.js";
import autorizarRoles from "../middlewares/autorizarRol.js";

const router = Router();

/**
 * ✅ Rutas protegidas por roles:
 * - 1 Instructor, 2 Coordinador, 3 (ajusta si quieres)
 */

// GET - Ver todas las fichas
router.get("/", verificarToken, autorizarRoles(1, 2, 3), obtenerFichas);

// GET - Fichas activas
router.get("/activas", verificarToken, autorizarRoles(3), obtenerFichasActivas);

// GET - Fichas inactivas
router.get("/inactivas", verificarToken, autorizarRoles(3), obtenerFichasInactivas);

// GET - Una ficha por ID
router.get("/:id", verificarToken, autorizarRoles(1, 2, 3), obtenerFichaPorId);

// POST - Crear ficha
router.post("/", verificarToken, autorizarRoles(1, 2, 3), crearFicha);

// PUT - Actualizar ficha
router.put("/:id", verificarToken, autorizarRoles(1, 2, 3), actualizarFicha);

// DELETE - Eliminar ficha
router.delete("/:id", verificarToken, autorizarRoles(1, 2, 3), eliminarFicha);

// PATCH - Cambiar estado (activar/desactivar)
router.patch("/:id/estado", verificarToken, autorizarRoles(3), cambiarEstadoFicha);

export default router;


