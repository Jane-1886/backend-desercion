
// Importamos base de datos, jwt y bcrypt
import db from '../config/db.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

/**
 * 🔐 LOGIN
 * Iniciar sesión y generar token JWT si el correo y contraseña coinciden
 */
export const login = async (req, res) => {
  console.log('🟢 Petición recibida en /login');
  console.log('📩 Datos:', req.body);

  const { email, contraseña } = req.body;

  try {
    const [filas] = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [email]);

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = filas[0];

    console.log("Contraseña recibida:", contraseña);
    console.log("Contraseña en la base:", usuario.Contraseña);

    const contraseñaValida = await bcrypt.compare(contraseña, usuario.Contraseña);

    if (!contraseñaValida) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    const token = jwt.sign(
      {
        id: usuario.ID_Usuario,
        nombre: usuario.Nombre_Usuario,
        rol: usuario.ID_Rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.json({
      mensaje: 'Login exitoso',
      token
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};


/**
 * 📝 REGISTRO DE USUARIO NUEVO (Listo para activar desde el frontend)
 * ⚠️ Actualmente deshabilitado, pendiente de conectar desde el frontend
 */
// export const registrarUsuario = async (req, res) => {
//   const { nombre, email, rol, contraseña } = req.body;

//   if (!nombre || !email || !rol || !contraseña) {
//     return res.status(400).json({ mensaje: 'Todos los campos son obligatorios.' });
//   }

//   try {
//     const [usuariosExistentes] = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [email]);
//     if (usuariosExistentes.length > 0) {
//       return res.status(409).json({ mensaje: 'El correo ya está registrado.' });
//     }

//     const contraseñaEncriptada = await bcrypt.hash(contraseña, 10);

//     const sql = `
//       INSERT INTO Usuarios (Nombre_Usuario, Email, ID_Rol, Contraseña)
//       VALUES (?, ?, ?, ?)
//     `;
//     const [resultado] = await db.query(sql, [nombre, email, rol, contraseñaEncriptada]);

//     res.status(201).json({ mensaje: 'Usuario registrado exitosamente', id: resultado.insertId });
//   } catch (error) {
//     console.error('Error al registrar usuario:', error);
//     res.status(500).json({ mensaje: 'Error interno al registrar usuario' });
//   }
// };


/**
 * 🔁 RECUPERACIÓN DE CONTRASEÑA (Listo para activar desde el frontend)
 * ⚠️ Desactivado por ahora hasta que el formulario esté listo
 */
// export const recuperarContraseña = async (req, res) => {
//   const { email, nuevaContraseña } = req.body;

//   if (!email || !nuevaContraseña) {
//     return res.status(400).json({ mensaje: 'Email y nueva contraseña son obligatorios.' });
//   }

//   try {
//     const [usuarios] = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [email]);
//     if (usuarios.length === 0) {
//       return res.status(404).json({ mensaje: 'Correo no registrado.' });
//     }

//     const nuevaHash = await bcrypt.hash(nuevaContraseña, 10);
//     await db.query('UPDATE Usuarios SET Contraseña = ? WHERE Email = ?', [nuevaHash, email]);

//     res.json({ mensaje: 'Contraseña actualizada exitosamente.' });
//   } catch (error) {
//     console.error('Error al recuperar contraseña:', error);
//     res.status(500).json({ mensaje: 'Error interno al cambiar la contraseña.' });
//   }
// };
