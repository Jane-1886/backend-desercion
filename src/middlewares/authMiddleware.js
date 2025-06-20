
// Importamos jsonwebtoken para verificar el token
import jwt from 'jsonwebtoken';

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
    req.usuario = verificado; // Guardamos los datos decodificados en la petición
    next(); // Continuamos con la siguiente función
  } catch (error) {
    res.status(400).json({ mensaje: 'Token inválido o expirado.' });
  }
};

export default verificarToken;
