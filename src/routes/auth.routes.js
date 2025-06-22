
import express from 'express';
import { login } from '../controllers/auth.controller.js';
// import { registrarUsuario, recuperarContraseña } from '../controllers/auth.controller.js'; // ✅ Descomentar cuando se activen

const router = express.Router();

/**
 * 📥 Ruta pública para iniciar sesión
 */
router.post('/login', login);

/**
 * 📝 Ruta pública para registrar usuario
 * ⚠️ Desactivada por ahora, lista para usar cuando el frontend tenga el formulario
 */
// router.post('/registro', registrarUsuario);

/**
 * 🔁 Ruta pública para recuperar contraseña
 * ⚠️ Desactivada por ahora, lista para usar cuando el frontend lo permita
 */
// router.post('/recuperar', recuperarContraseña);

export default router;

