
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
    // Buscar usuario por correo
    const [[usuario]] = await db.query(`
      SELECT u.ID_Usuario, u.Nombre_Usuario, u.Contraseña, r.Nombre_Rol
      FROM Usuarios u
      JOIN Roles r ON u.ID_Rol = r.ID_Rol
      WHERE u.Email = ?
    `, [email]);

    // 🔍 Mostrar el usuario que se encontró
    console.log('🧑 Usuario encontrado:', usuario);


    if (!usuario) {
      return res.status(404).json({ mensaje: 'Correo no registrado' });
    }
    // 🔍 Mostrar lo que se va a comparar
    console.log('🔎 Contraseña ingresada:', contrasena);
    console.log('🔒 Hash almacenado:', usuario.Contraseña);

    // Verificar contraseña (comparar con hash)
    const contraseñaValida = await bcrypt.compare(contrasena, usuario.Contraseña);
    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.ID_Usuario,
        nombre: usuario.Nombre_Usuario,
        rol: usuario.Nombre_Rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '4h' } // Puedes ajustar el tiempo
    );

    // Devolver token y datos
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
