import db from '../config/db.js';

// ✅ Crear un nuevo rol
export const crearRol = async (req, res) => {
  const { nombre } = req.body;

  // 1. Validar que se haya enviado el nombre del rol
  if (!nombre || nombre.trim() === '') {
    return res.status(400).json({ mensaje: 'El nombre del rol es obligatorio' });
  }

  const nombreNormalizado = nombre.trim();

  try {
    // 2. Verificar si ya existe un rol con ese nombre
    const verificarSql = 'SELECT * FROM Roles WHERE Nombre_Rol = ?';
    const [existe] = await db.query(verificarSql, [nombreNormalizado]);

    if (existe.length > 0) {
      return res.status(409).json({ mensaje: 'Ese rol ya existe' });
    }

    // 3. Insertar el nuevo rol
    const insertarSql = 'INSERT INTO Roles (Nombre_Rol) VALUES (?)';
    const [resultado] = await db.query(insertarSql, [nombreNormalizado]);

    // 4. Enviar respuesta al cliente
    res.status(201).json({
      mensaje: 'Rol creado correctamente',
      id: resultado.insertId
    });

  } catch (error) {
    console.error('❌ Error al crear rol:', error);
    res.status(500).json({ mensaje: 'Error al crear el rol', error });
  }
};

// ✅ Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const [filas] = await db.query('SELECT * FROM Roles ORDER BY Nombre_Rol ASC');
    res.status(200).json(filas);
  } catch (error) {
    console.error('❌ Error al obtener roles:', error);
    res.status(500).json({ mensaje: 'Error al obtener los roles', error });
  }
};


// Cargar un instructor (rol 2)
export const cargarInstructor = async (req, res) => {
  const { nombre, email, contrasena } = req.body;

  // Validación básica
  if (!nombre || !email || !contrasena) {
    return res.status(400).json({ mensaje: 'Todos los campos son obligatorios' });
  }

  try {
    // Verificar si ya existe el correo
    const [existe] = await db.query('SELECT * FROM Usuarios WHERE Email = ?', [email]);
    if (existe.length > 0) {
      return res.status(409).json({ mensaje: 'Este correo ya está registrado' });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Insertar con rol 2 (Instructor)
    const sql = `
      INSERT INTO Usuarios (Nombre_Usuario, Email, Contraseña, ID_Rol)
      VALUES (?, ?, ?, 2)
    `;
    await db.query(sql, [nombre.trim(), email.trim(), hashedPassword]);

    res.status(201).json({ mensaje: 'Instructor registrado correctamente' });

  } catch (error) {
    console.error('❌ Error al registrar instructor:', error);
    res.status(500).json({ mensaje: 'Error interno al registrar el instructor', error });
  }
};
