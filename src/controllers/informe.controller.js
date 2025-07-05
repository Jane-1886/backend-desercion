
import PDFDocument from 'pdfkit';
import fs from 'fs';
import db from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Para usar __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 🔹 Informe general
export const generarInformePDF = async (req, res) => {
  try {
    const [aprendicesRows] = await db.query('SELECT COUNT(*) AS total FROM Aprendices');
    const totalAprendices = aprendicesRows[0].total;

    const [alertasRows] = await db.query('SELECT COUNT(*) AS total FROM alertas');
    const totalAlertas = alertasRows[0].total;

    const [topAlertas] = await db.query(`
      SELECT ID_Aprendiz, COUNT(*) AS cantidad_alertas
      FROM alertas
      GROUP BY ID_Aprendiz
      ORDER BY cantidad_alertas DESC
      LIMIT 5
    `);

    const [fechaMasAlertas] = await db.query(`
      SELECT DATE(Fecha_Alerta) AS fecha, COUNT(*) AS cantidad
      FROM alertas
      GROUP BY DATE(Fecha_Alerta)
      ORDER BY cantidad DESC
      LIMIT 1
    `);

    const doc = new PDFDocument({ margin: 50 });
    const fileName = `informe-estadisticas-${Date.now()}.pdf`;

    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    const logoPath = path.join(__dirname, '../assets/logo.jpg');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { width: 120, align: 'left' });
    }

    doc.fontSize(26).fillColor('#39A900').text('SENICHECK', {
      align: 'center',
      underline: true,
    });

    doc.moveDown(0.5).fontSize(18).fillColor('black').text('Informe de Estadísticas', {
      align: 'center',
    });

    doc.moveDown();
    doc.fillColor('black').fontSize(12);
    doc.text(`Total de Aprendices Registrados: ${totalAprendices}`);
    doc.text(`Total de Alertas Generadas: ${totalAlertas}`);
    doc.moveDown();

    doc.fontSize(14).fillColor('#00304D').text('Top 5 Aprendices con más Alertas:', { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('black');
    doc.text('ID Aprendiz     |   Cantidad de Alertas');
    doc.moveDown(0.3);
    topAlertas.forEach(item => {
      doc.text(`${item.ID_Aprendiz}              |   ${item.cantidad_alertas}`);
    });
    doc.moveDown();

    if (fechaMasAlertas.length > 0) {
      const fechaTop = fechaMasAlertas[0];
      doc.fillColor('#39A900').text(`Fecha con más alertas: ${fechaTop.fecha} (${fechaTop.cantidad} alertas)`);
    } else {
      doc.text('No se encontraron fechas con alertas.');
    }

    doc.end();

  } catch (error) {
    console.error('❌ Error al generar el PDF:', error.message);
    res.status(500).json({ mensaje: 'Error al generar el informe PDF', error });
  }
};

// 🔹 Informe por ficha
export const generarInformePorFicha = async (req, res) => {
  const fichaId = req.params.id;

  try {
    const [[ficha]] = await db.query(`
      SELECT f.ID_Ficha, f.Nombre_Ficha 
      FROM fichas_de_formacion f 
      WHERE f.ID_Ficha = ?
    `, [fichaId]);

    if (!ficha) {
      return res.status(404).json({ mensaje: 'Ficha no encontrada' });
    }

    const [aprendices] = await db.query(`
      SELECT a.ID_Aprendiz, a.Nombre, a.Apellido
      FROM aprendices a
      WHERE a.ID_Ficha = ?
    `, [fichaId]);

    const [totalAlertas] = await db.query(`
      SELECT COUNT(*) AS total
      FROM alertas a
      JOIN aprendices ap ON a.ID_Aprendiz = ap.ID_Aprendiz
      WHERE ap.ID_Ficha = ?
    `, [fichaId]);

    const [alertasPorAprendiz] = await db.query(`
      SELECT ap.ID_Aprendiz, ap.Nombre, ap.Apellido, COUNT(*) AS cantidad_alertas
      FROM alertas a
      JOIN aprendices ap ON a.ID_Aprendiz = ap.ID_Aprendiz
      WHERE ap.ID_Ficha = ?
      GROUP BY ap.ID_Aprendiz
      ORDER BY cantidad_alertas DESC
    `, [fichaId]);

    const [inasistencias] = await db.query(`
      SELECT ap.ID_Aprendiz, ap.Nombre, ap.Apellido, asi.*
      FROM asistencia asi
      JOIN aprendices ap ON asi.ID_Aprendiz = ap.ID_Aprendiz
      WHERE ap.ID_Ficha = ?
    `, [fichaId]);

    let aprendizEnRiesgo = null;
    let maxInasistencias = 0;
    const conteo = {};

    inasistencias.forEach(a => {
      const total = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].reduce((acc, dia) => {
        return acc + (a[dia] === 'No asistió' || a[dia] === 'No justificada' ? 1 : 0);
      }, 0);

      if (!conteo[a.ID_Aprendiz]) {
        conteo[a.ID_Aprendiz] = {
          nombre: `${a.Nombre} ${a.Apellido}`,
          total
        };
      } else {
        conteo[a.ID_Aprendiz].total += total;
      }

      if (conteo[a.ID_Aprendiz].total > maxInasistencias) {
        maxInasistencias = conteo[a.ID_Aprendiz].total;
        aprendizEnRiesgo = conteo[a.ID_Aprendiz];
      }
    });

    const doc = new PDFDocument({ margin: 50 });
    const fileName = `informe-ficha-${fichaId}.pdf`;

    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);

    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(22).fillColor('#39A900').text('SENICHECK - Informe por Ficha', { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).fillColor('black');
    doc.text(`Ficha: ${ficha.Nombre_Ficha} (ID: ${ficha.ID_Ficha})`);
    doc.text(`Total de aprendices: ${aprendices.length}`);
    doc.text(`Total de alertas registradas: ${totalAlertas[0].total}`);
    doc.moveDown();

    doc.fontSize(14).text('Listado de Aprendices:', { underline: true });
    aprendices.forEach((a, index) => {
      doc.fontSize(11).text(`${index + 1}. ${a.Nombre} ${a.Apellido}`);
    });
    doc.moveDown();

    doc.fontSize(14).text('Resumen de Asistencia:', { underline: true });
    inasistencias.forEach(reg => {
      doc.fontSize(11).text(`• ${reg.Nombre} ${reg.Apellido} - Lunes a Viernes: [${reg.Lunes}, ${reg.Martes}, ${reg.Miércoles}, ${reg.Jueves}, ${reg.Viernes}]`);
    });
    doc.moveDown();

    if (aprendizEnRiesgo) {
      const observacion = maxInasistencias >= 3 ? 'En riesgo por inasistencias' : 'Aprendiz activo';
      doc.fontSize(14).fillColor('#B00020').text('Aprendiz con más inasistencias:', { underline: true });
      doc.fillColor('black').fontSize(12).text(`• ${aprendizEnRiesgo.nombre}`);
      doc.text(`• Total de inasistencias: ${maxInasistencias}`);
      doc.text(`• Observación: ${observacion}`);
    } else {
      doc.fontSize(12).text('No hay registros de inasistencias en esta ficha.');
    }

    doc.end();

  } catch (error) {
    console.error('❌ Error al generar informe por ficha:', error.message);
    res.status(500).json({ mensaje: 'Error al generar informe por ficha', error });
  }
};
export const generarInformePorAprendiz = async (req, res) => {
  const idAprendiz = req.params.id;

  try {
    // 1. Obtener datos básicos del aprendiz y su ficha
    const [[aprendiz]] = await db.query(`
      SELECT ap.Nombre, ap.Apellido, f.Nombre_Ficha, f.ID_Ficha
      FROM aprendices ap
      JOIN fichas_de_formacion f ON ap.ID_Ficha = f.ID_Ficha
      WHERE ap.ID_Aprendiz = ?
    `, [idAprendiz]);

    if (!aprendiz) {
      return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });
    }

    // 2. Obtener asistencia
    const [asistencias] = await db.query(`
      SELECT Lunes, Martes, Miércoles, Jueves, Viernes
      FROM asistencia
      WHERE ID_Aprendiz = ?
    `, [idAprendiz]);

    // 3. Obtener alertas
    const [alertas] = await db.query(`
      SELECT DATE(Fecha_Alerta) AS fecha, Estado
      FROM alertas
      WHERE ID_Aprendiz = ?
    `, [idAprendiz]);

    // 4. Obtener intervenciones
    const [intervenciones] = await db.query(`
      SELECT Tipo_Intervencion, Fecha_Intervencion, Resultado
      FROM intervenciones
      WHERE ID_Aprendiz = ?
    `, [idAprendiz]);

    // 5. Obtener plan de seguimiento
    const [planes] = await db.query(`
      SELECT Tipo_Seguimiento, Fecha_Inicio, Fecha_Fin, Estado, Descripcion
      FROM planes_seguimiento
      WHERE ID_Aprendiz = ?
      ORDER BY Fecha_Inicio DESC LIMIT 1
    `, [idAprendiz]);

    // 6. Crear PDF
    const doc = new PDFDocument({ margin: 50 });
    const fileName = `informe-aprendiz-${idAprendiz}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    doc.fontSize(18).fillColor('#39A900').text('Informe por Aprendiz', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).fillColor('black').text(`Nombre: ${aprendiz.Nombre} ${aprendiz.Apellido}`);
    doc.text(`Ficha: ${aprendiz.Nombre_Ficha} (ID: ${aprendiz.ID_Ficha})`);
    doc.moveDown();

    // Sección: Asistencias
    doc.fontSize(14).text('Registro de Asistencia:', { underline: true });
    if (asistencias.length > 0) {
      asistencias.forEach((a, i) => {
        doc.fontSize(11).text(`Semana ${i + 1}: [${a.Lunes}, ${a.Martes}, ${a.Miércoles}, ${a.Jueves}, ${a.Viernes}]`);
      });
    } else {
      doc.text('No se encontraron registros de asistencia.');
    }

    doc.moveDown();

    // Sección: Alertas
    doc.fontSize(14).text('Alertas Generadas:', { underline: true });
    if (alertas.length > 0) {
      alertas.forEach(a => {
        doc.fontSize(11).text(`• ${a.fecha} - Estado: ${a.Estado}`);
      });
    } else {
      doc.text('Sin alertas registradas.');
    }

    doc.moveDown();

    // Sección: Intervenciones
    doc.fontSize(14).text('Intervenciones Realizadas:', { underline: true });
    if (intervenciones.length > 0) {
      intervenciones.forEach(i => {
        doc.fontSize(11).text(`• ${i.Fecha_Intervencion} - ${i.Tipo_Intervencion} (${i.Resultado})`);
      });
    } else {
      doc.text('No hay intervenciones registradas.');
    }

    doc.moveDown();

    // Sección: Plan de seguimiento
    doc.fontSize(14).text('Plan de Seguimiento:', { underline: true });
    if (planes.length > 0) {
      const p = planes[0];
      doc.fontSize(11).text(`Tipo: ${p.Tipo_Seguimiento}`);
      doc.text(`Estado: ${p.Estado}`);
      doc.text(`Duración: ${p.Fecha_Inicio} a ${p.Fecha_Fin}`);
      doc.text(`Descripción: ${p.Descripcion}`);
    } else {
      doc.text('Sin plan de seguimiento activo.');
    }

    doc.end();

  } catch (error) {
    console.error('❌ Error al generar informe por aprendiz:', error.message);
    res.status(500).json({ mensaje: 'Error al generar informe por aprendiz', error });
  }
};
export const obtenerResumenEstadisticas = async (req, res) => {
  try {
    // Total de aprendices
    const [aprendicesRows] = await db.query('SELECT COUNT(*) AS total FROM Aprendices');
    const totalAprendices = aprendicesRows[0].total;

    // Total de alertas
    const [alertasRows] = await db.query('SELECT COUNT(*) AS total FROM alertas');
    const totalAlertas = alertasRows[0].total;

    // Total de fichas
    const [fichasRows] = await db.query('SELECT COUNT(*) AS total FROM fichas_de_formacion');
    const totalFichas = fichasRows[0].total;

    // Top 5 aprendices con más alertas
    const [topAlertas] = await db.query(`
      SELECT ID_Aprendiz AS idAprendiz, COUNT(*) AS cantidad
      FROM alertas
      GROUP BY ID_Aprendiz
      ORDER BY cantidad DESC
      LIMIT 5
    `);

    // Fecha con más alertas
    const [fechaMasAlertas] = await db.query(`
      SELECT DATE(Fecha_Alerta) AS fecha, COUNT(*) AS cantidad
      FROM alertas
      GROUP BY DATE(Fecha_Alerta)
      ORDER BY cantidad DESC
      LIMIT 1
    `);

    // Ficha con más alertas
    const [fichaMasAlertas] = await db.query(`
      SELECT f.ID_Ficha, f.Nombre_Ficha, COUNT(*) AS total_alertas
      FROM alertas a
      JOIN aprendices ap ON a.ID_Aprendiz = ap.ID_Aprendiz
      JOIN fichas_de_formacion f ON ap.ID_Ficha = f.ID_Ficha
      GROUP BY ap.ID_Ficha
      ORDER BY total_alertas DESC
      LIMIT 1
    `);

    // Aprendiz con más inasistencias
    const [inasistencias] = await db.query(`
      SELECT ap.ID_Aprendiz, ap.Nombre, ap.Apellido, asi.*
      FROM asistencia asi
      JOIN aprendices ap ON asi.ID_Aprendiz = ap.ID_Aprendiz
    `);

    const conteo = {};
    inasistencias.forEach(a => {
      const total = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].reduce((acc, dia) => {
        return acc + (a[dia] === 'No asistió' || a[dia] === 'No justificada' ? 1 : 0);
      }, 0);
      if (!conteo[a.ID_Aprendiz]) {
        conteo[a.ID_Aprendiz] = {
          nombre: `${a.Nombre} ${a.Apellido}`,
          total
        };
      } else {
        conteo[a.ID_Aprendiz].total += total;
      }
    });

    let aprendizConMasInasistencias = { nombre: '', total: 0 };
    for (const id in conteo) {
      if (conteo[id].total > aprendizConMasInasistencias.total) {
        aprendizConMasInasistencias = conteo[id];
      }
    }

    // Promedio general de asistencia (asistencias justificadas o sí asistió)
    const [totalAsistencia] = await db.query(`
      SELECT Lunes, Martes, Miércoles, Jueves, Viernes
      FROM asistencia
    `);

    let totalDias = 0;
    let asistenciasPositivas = 0;

    totalAsistencia.forEach(reg => {
      ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'].forEach(dia => {
        totalDias++;
        if (reg[dia] === 'Sí asistió' || reg[dia] === 'Justificada') {
          asistenciasPositivas++;
        }
      });
    });

    const promedioAsistencia = totalDias > 0 ? (asistenciasPositivas / totalDias * 100).toFixed(2) : '0.00';

    // Resultado final
    const resumen = {
      totalAprendices,
      totalAlertas,
      totalFichas,
      top5Alertas: topAlertas,
      fechaConMasAlertas: fechaMasAlertas[0] || null,
      fichaConMasAlertas: fichaMasAlertas[0] || null,
      aprendizConMasInasistencias,
      promedioAsistencia: `${promedioAsistencia}%`
    };

    res.json(resumen);

  } catch (error) {
    console.error('❌ Error al obtener resumen:', error.message);
    res.status(500).json({ mensaje: 'Error al obtener estadísticas del sistema', error });
  }
};

/**
 * Genera un informe PDF con el resumen de inasistencias a nivel institucional
 * Solo accesible por el rol Administrador (ID_Rol = 3)
 */

export const generarInformeInstitucional  = async (req, res) => {
  try {
    const [datos] = await db.query(`
      SELECT
        ap.ID_Aprendiz,
        ap.Nombre AS NombreAprendiz,
        ap.Estado AS EstadoAprendiz,
        f.Nombre_Ficha,
        f.Estado AS EstadoFicha,
        SUM(a.Lunes = 'No asistió') +
        SUM(a.Martes = 'No asistió') +
        SUM(a.Miércoles = 'No asistió') +
        SUM(a.Jueves = 'No asistió') +
        SUM(a.Viernes = 'No asistió') AS TotalInasistencias
      FROM Aprendices ap
      JOIN Fichas_de_Formacion f ON ap.ID_Ficha = f.ID_Ficha
      JOIN Asistencia a ON ap.ID_Aprendiz = a.ID_Aprendiz
      GROUP BY ap.ID_Aprendiz
      ORDER BY TotalInasistencias DESC
    `);

    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    // Encabezado de respuesta
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=reporte_inasistencia_institucional.pdf');

    doc.pipe(res);

    // Título
    doc.fontSize(18).text('📋 Reporte Institucional de Inasistencias', { align: 'center' });
    doc.moveDown(1);

    // Encabezados de tabla
    const tableTop = 100;
    const columnSpacing = 100;
    const rowHeight = 20;

    doc.fontSize(12);
    doc.text('N°', 50, tableTop);
    doc.text('Aprendiz', 80, tableTop);
    doc.text('Ficha', 200, tableTop);
    doc.text('Estado A.', 300, tableTop);
    doc.text('Estado F.', 380, tableTop);
    doc.text('Inasistencias', 470, tableTop);

    let y = tableTop + 25;

    datos.forEach((fila, index) => {
      // Pintamos las filas normales
      doc.fillColor('black');
      doc.text(index + 1, 50, y);
      doc.text(fila.NombreAprendiz, 80, y);
      doc.text(fila.Nombre_Ficha, 200, y);
      doc.text(fila.EstadoAprendiz, 300, y);
      doc.text(fila.EstadoFicha, 380, y);

      // Coloreamos de rojo si tiene inasistencias
      if (fila.TotalInasistencias > 0) {
        doc.fillColor('red');
      } else {
        doc.fillColor('green');
      }

      doc.text(fila.TotalInasistencias.toString(), 470, y);
      y += rowHeight;
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar el informe institucional:', error);
    res.status(500).json({
      mensaje: 'Error al generar el informe institucional',
      error: error.message,
    });
  }
};
