
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

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
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

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
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
