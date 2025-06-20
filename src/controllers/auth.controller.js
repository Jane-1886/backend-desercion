
// Importamos base de datos y jsonwebtoken
import db from '../config/db.js';
import jwt from 'jsonwebtoken';


 /* Controlador de autenticación
  Permite iniciar sesión y obtener un token JWT*/
 
export const login = async (req, res) => {
   console.log('🟢 Petición recibida en /login');
  console.log('📩 Datos:', req.body);

  const { email, contraseña } = req.body;

  try {
    // Buscar usuario por correo
    const [filas] = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [email]);

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = filas[0];


    console.log("Contraseña recibida:", contraseña);
    console.log("Contraseña en la base:", usuario.Contraseña);


    // Validar contraseña directamente (sin encriptar por ahora)
    if (usuario.Contraseña !== contraseña) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token
    const token = jwt.sign(
      {
        id: usuario.ID_Usuario,
        nombre: usuario.Nombre_Usuario,
        rol: usuario.ID_Rol
      },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    // Enviar token en respuesta
    res.json({
      mensaje: 'Login exitoso',
      token
    });

  } catch (error) {
    res.status(500).json({ mensaje: 'Error en el servidor', error });
  }
};

// Importamos base de datos y jsonwebtoken
/*import db from '../config/db.js';
import jwt from 'jsonwebtoken';

export const login = async (req, res) => {
  console.log('🟢 Petición recibida en /login');
  console.log('📩 Datos:', req.body);

  const { email, contraseña } = req.body;

  try {
    // Buscar usuario por correo
    const [filas] = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [email]);

    if (filas.length === 0) {
      return res.status(404).json({ mensaje: 'Usuario no encontrado' });
    }

    const usuario = filas[0];

    // Validar contraseña en texto plano
    if (usuario.Contraseña !== contraseña) {
      return res.status(401).json({ mensaje: 'Contraseña incorrecta' });
    }

    // Generar token JWT
    const token = jwt.sign(
      {
        id: usuario.ID_Usuario,
        nombre: usuario.Nombre_Usuario,
        rol: usuario.ID_Rol
      },
      process.env.JWT_SECRET || 'secreto123', // Por si falta el archivo .env
      { expiresIn: '2h' }
    );

    // Devolver datos útiles al frontend
    return res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario.ID_Usuario,
        nombre: usuario.Nombre_Usuario,
        email: usuario.Email,
        rol: usuario.ID_Rol
      }
    });

  } catch (error) {
    console.error('❌ Error en login:', error.message);
    return res.status(500).json({ mensaje: 'Error en el servidor' });
  }
};*/

