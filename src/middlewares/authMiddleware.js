// src/middlewares/authMiddleware.js
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const verificarToken = (req, res, next) => {
  if (req.method === "OPTIONS") return next(); // deja pasar preflight CORS

  const auth = req.headers.authorization || req.header("Authorization") || "";
  if (!auth) return res.status(401).json({ mensaje: "Acceso denegado. Falta Authorization." });

  const token = auth.startsWith("Bearer ") ? auth.slice(7).trim() : auth.trim();
  if (!token) return res.status(401).json({ mensaje: "Acceso denegado. Token vacío." });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = payload; // queda disponible para el siguiente middleware/controlador
    next();
  } catch (e) {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

export default verificarToken;
