
import bcrypt from 'bcryptjs';
import db from './src/config/db.js'; // Ajusta la ruta si tu archivo está en otro lugar

const actualizarContraseñas = async () => {
  try {
    const [usuarios] = await db.query('SELECT ID_Usuario, Contraseña FROM Usuarios');

    for (let u of usuarios) {
      // Solo si no está cifrada (por ejemplo, si tiene menos de 20 caracteres asumimos que es texto plano)
      if (u.Contraseña.length < 20) {
        const hash = await bcrypt.hash(u.Contraseña, 10);
        await db.query('UPDATE Usuarios SET Contraseña = ? WHERE ID_Usuario = ?', [hash, u.ID_Usuario]);
        console.log(`✔ Usuario ${u.ID_Usuario} actualizado`);
      } else {
        console.log(`🔒 Usuario ${u.ID_Usuario} ya tiene contraseña cifrada`);
      }
    }

    console.log('✅ Proceso terminado');
    process.exit();
  } catch (error) {
    console.error('❌ Error al actualizar contraseñas:', error.message);
    process.exit(1);
  }
};

actualizarContraseñas();
