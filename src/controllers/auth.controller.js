import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import db from '../config/db.js';

// Función para iniciar sesión
export const login = async (req, res) => {
  const { email, contrasena } = req.body;

  // 🔍 MOSTRAR QUÉ LLEGA EN LA PETICIÓN
  console.log('📥 Email recibido:', email);
  console.log('🔐 Contraseña recibida:', contrasena);

  try {
    // Buscar usuario por correo e incluir ID_Rol
    const [[usuario]] = await db.query(`
      SELECT u.ID_Usuario, u.Nombre_Usuario, u.Contraseña, u.ID_Rol, r.Nombre_Rol
      FROM Usuarios u
      JOIN Roles r ON u.ID_Rol = r.ID_Rol
      WHERE u.Email = ?
    `, [email]);

    console.log('🧑 Usuario encontrado:', usuario);

    if (!usuario) {
      return res.status(404).json({ mensaje: 'Correo no registrado' });
    }

    console.log('🔎 Contraseña ingresada:', contrasena);
    console.log('🔒 Hash almacenado:', usuario.Contraseña);

    // Verificar contraseña
    const contraseñaValida = await bcrypt.compare(contrasena, usuario.Contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // ✅ Generar token incluyendo ID_Rol
    const token = jwt.sign(
      {
        ID_Usuario: usuario.ID_Usuario,
        Email: usuario.Email,
        ID_Rol: usuario.ID_Rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' }
    );

    // Responder con token y datos básicos
    res.json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.ID_Usuario,
        nombre: usuario.Nombre_Usuario,
        rol: usuario.Nombre_Rol
      }
    });

  } catch (error) {
    console.error('Error en login:', error.message);
    res.status(500).json({ mensaje: 'Error al iniciar sesión', error });
  }
};
