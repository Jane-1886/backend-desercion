// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

const SECRET = process.env.JWT_SECRET || "mi_clave_secreta";

/**
 * POST /api/auth/login
 * body: { email, contrasena }
 */
export const login = async (req, res) => {
  const email = (req.body?.email ?? "").toString().trim();
  const contrasena = (req.body?.contrasena ?? "").toString();

  if (!email || !contrasena) {
    return res.status(400).json({ mensaje: "Email y contraseña son obligatorios" });
  }

  try {
    // Usa SIEMPRE la columna real: Contrasena (sin tilde)
    const [rows] = await db.query(
      `
      SELECT 
        u.ID_Usuario       AS id,
        u.Nombre_Usuario   AS nombre,
        u.Contrasena       AS hash,
        u.ID_Rol           AS rolId,
        r.Nombre_Rol       AS rolNombre,
        u.Email            AS email
      FROM Usuarios u
      INNER JOIN Roles r ON u.ID_Rol = r.ID_Rol
      WHERE u.Email = ?
      LIMIT 1
      `,
      [email]
    );

    if (rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const user = rows[0];

    // Comparar hash
    const ok = await bcrypt.compare(contrasena, user.hash);
    if (!ok) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // Token con rol NUMÉRICO
    const payload = {
      id: Number(user.id),
      rol: Number(user.rolId),
      nombre: user.nombre,
      email: user.email,
    };

    // Validación extra, por si algo raro
    if (!Number.isFinite(payload.id) || !Number.isFinite(payload.rol)) {
      return res.status(500).json({ mensaje: "Inconsistencia en id/rol del usuario." });
    }

    const token = jwt.sign(payload, SECRET, { expiresIn: "8h" });

    return res.json({
      token,
      usuario: {
        id: payload.id,
        nombre: payload.nombre,
        rol: payload.rol,           // numérico
        rolNombre: user.rolNombre,  // descriptivo
        email: payload.email,
      },
    });
  } catch (error) {
    console.error("❌ Error en login:", error);
    return res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
