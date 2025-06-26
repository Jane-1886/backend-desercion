
import PDFDocument from 'pdfkit';
import fs from 'fs';
import db from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Para poder usar __dirname con ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

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

    // Agregar logo
    const logoPath = path.join(__dirname, '../assets/logo.jpg');
    if (fs.existsSync(logoPath)) {
      doc.image(logoPath, { width: 120, align: 'left' });
    }

   // Título principal "SENICHECK"
doc
  .fontSize(26)
  .fillColor('#39A900') // Verde institucional
  .text('SENICHECK', {
    align: 'center',
    underline: true,
  });

// Subtítulo "Informe de Estadísticas"
doc
  .moveDown(0.5)
  .fontSize(18)
  .fillColor('black') // Volver al color normal
  .text('Informe de Estadísticas', { align: 'center' });

doc.moveDown(); // Espacio antes del contenido

    doc.moveDown();
    doc.fillColor('black').fontSize(12);
    doc.text(`Total de Aprendices Registrados: ${totalAprendices}`);
    doc.text(`Total de Alertas Generadas: ${totalAlertas}`);
    doc.moveDown();

    // Tabla del top 5
    doc.fontSize(14).fillColor('#00304D').text('Top 5 Aprendices con más Alertas:', { underline: true });
    doc.moveDown(0.5);

    doc.fontSize(12).fillColor('black');
    doc.text('ID Aprendiz     |   Cantidad de Alertas', { bold: true });
    doc.moveDown(0.3);
    topAlertas.forEach(item => {
      doc.text(`${item.ID_Aprendiz}              |   ${item.cantidad_alertas}`);
    });
    doc.moveDown();

    // Fecha con más alertas
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
