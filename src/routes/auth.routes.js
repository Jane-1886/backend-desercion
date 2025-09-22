
import express from "express";
import { login } from "../controllers/auth.controller.js";
import verificarToken from '../middlewares/authMiddleware.js';


const router = express.Router();

// Público
router.post("/login", login);

// Protegido: para probar el token desde el front
router.get("/me", verificarToken, (req, res) => {
  res.json({ usuario: req.usuario });
});

export default router;
