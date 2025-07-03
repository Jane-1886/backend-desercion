import db from '../config/db.js';

// Crear un nuevo rol
export const crearRol = async (req, res) => {
  const { nombre } = req.body;

  try {
    const sql = 'INSERT INTO Roles (Nombre_Rol) VALUES (?)';
    const [resultado] = await db.query(sql, [nombre]);

    res.status(201).json({
      mensaje: 'Rol creado correctamente',
      id: resultado.insertId
    });
  } catch (error) {
    console.error('❌ Error al crear rol:', error.message);
    res.status(500).json({ mensaje: 'Error al crear el rol', error });
  }
};

// Obtener todos los roles
export const obtenerRoles = async (req, res) => {
  try {
    const [filas] = await db.query('SELECT * FROM Roles');
    res.json(filas);
  } catch (error) {
    console.error('❌ Error al obtener roles:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener los roles', error });
  }
};
