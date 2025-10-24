// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
const SECRET = process.env.JWT_SECRET || "mi_clave_secreta";

const verificarToken = (req, res, next) => {
  if (req.method === "OPTIONS") return next();

  const raw = req.headers.authorization || req.header("Authorization") || "";
  const token = raw.startsWith("Bearer ") ? raw.slice(7).trim() : raw.trim();
  if (!token) return res.status(401).json({ mensaje: "Acceso denegado. Token vacío." });

  try {
    const p = jwt.verify(token, SECRET);
    req.usuario = {
      id: Number(p.id),
      rol: Number(p.rol),
      nombre: p.nombre ?? null,
      email: p.email ?? null,
    };
    if (!Number.isFinite(req.usuario.id) || !Number.isFinite(req.usuario.rol)) {
      return res.status(401).json({ mensaje: "Token inválido: id/rol no numéricos." });
    }
    next();
  } catch {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

export default verificarToken;
