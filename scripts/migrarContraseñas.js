// scripts/migrarContraseñas.js

import db from '../config/db.js';
import bcrypt from 'bcryptjs';

async function migrarContraseñas() {
  try {
    const [usuarios] = await db.query('SELECT ID_Usuario, Contraseña FROM Usuarios');

    for (const usuario of usuarios) {
      const { ID_Usuario, Contraseña } = usuario;

      const yaCifrada = Contraseña.startsWith('$2') && Contraseña.length > 20;
      if (yaCifrada) continue;

      const hash = await bcrypt.hash(Contraseña, 10);
      await db.query(
        'UPDATE Usuarios SET Contraseña = ? WHERE ID_Usuario = ?',
        [hash, ID_Usuario]
      );

      console.log(`✅ Contraseña cifrada para usuario ID ${ID_Usuario}`);
    }

    console.log('✅ Migración de contraseñas completada.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al migrar contraseñas:', error.message);
    process.exit(1);
  }
}

migrarContraseñas();
