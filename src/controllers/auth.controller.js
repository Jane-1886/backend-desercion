// src/controllers/auth.controller.js
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import db from "../config/db.js";

/**
 * POST /api/auth/login
 * body: { email, contrasena }
 */
export const login = async (req, res) => {
  const { email, contrasena } = req.body || {};

  if (!email || !contrasena) {
    return res
      .status(400)
      .json({ mensaje: "Email y contraseña son obligatorios" });
  }

  try {
    // Plantilla de SELECT: probamos primero con `Contraseña` y si falla
    // por columna desconocida, reintenta con `Contrasena`.
    const baseSQL =
      "SELECT " +
      "u.`ID_Usuario`   AS id, " +
      "u.`Nombre_Usuario` AS nombre, " +
      "u.__PASS__        AS hash, " + // <- se reemplaza abajo
      "u.`ID_Rol`        AS rolId, " +
      "r.`Nombre_Rol`    AS rolNombre, " +
      "u.`Email`         AS email " +
      "FROM `Usuarios` u " +
      "INNER JOIN `Roles` r ON u.`ID_Rol` = r.`ID_Rol` " +
      "WHERE u.`Email` = ? " +
      "LIMIT 1";

    let rows;
    try {
      // Intento 1: columna con tilde
      const [r1] = await db.query(
        baseSQL.replace("__PASS__", "`Contraseña`"),
        [email]
      );
      rows = r1;
    } catch (e) {
      if (e?.code === "ER_BAD_FIELD_ERROR") {
        // Intento 2: columna sin tilde
        const [r2] = await db.query(
          baseSQL.replace("__PASS__", "`Contrasena`"),
          [email]
        );
        rows = r2;
      } else {
        throw e;
      }
    }

    if (!rows || rows.length === 0) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    const user = rows[0];

    // Valida contraseña
    const ok = await bcrypt.compare(contrasena, user.hash);
    if (!ok) {
      return res.status(401).json({ mensaje: "Credenciales inválidas" });
    }

    // Genera token (incluye rol numérico)
    const token = jwt.sign(
      { id: user.id, rol: user.rolId, nombre: user.nombre },
      process.env.JWT_SECRET || "cambia-este-secreto",
      { expiresIn: "8h" }
    );

    // Respuesta consistente para el frontend
    return res.json({
      token,
      usuario: {
        id: user.id,
        nombre: user.nombre,
        rol: user.rolId,        // numérico (p. ej., 3)
        rolNombre: user.rolNombre, // texto (p. ej., "Coordinador")
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error en login:", error);
    return res.status(500).json({ mensaje: "Error al iniciar sesión" });
  }
};
