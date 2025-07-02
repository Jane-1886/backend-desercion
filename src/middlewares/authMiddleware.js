
// Importamos jsonwebtoken para verificar el token
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();
/**
 * Middleware de autenticación
 * Verifica si el token JWT enviado en los headers es válido
 */
const verificarToken = (req, res, next) => {
  // Obtenemos el token desde los headers
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ mensaje: 'Acceso denegado. Token no proporcionado.' });
  }

  try {
    // Quitamos el prefijo 'Bearer ' si está presente
    const tokenLimpio = token.startsWith('Bearer ') ? token.split(' ')[1] : token;

    // Verificamos el token usando la clave secreta
    const verificado = jwt.verify(tokenLimpio, process.env.JWT_SECRET);
    console.log('✅ Token decodificado:', verificado);
    req.usuario = verificado; // Guardamos los datos decodificados en la petición
    next(); // Continuamos con la siguiente función
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido o expirado.' });
  }
};
// Este middleware permite controlar qué roles pueden acceder a cada ruta

export const autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    const usuario = req.usuario;

    // Si no hay información del usuario o su rol no está permitido
    if (!usuario || !rolesPermitidos.includes(usuario.ID_Rol)) {
      return res.status(403).json({ mensaje: 'Acceso denegado: no tienes permisos suficientes.' });
    }

    // Todo bien, pasa al siguiente middleware o controlador
    next();
  };
};


export default verificarToken;
