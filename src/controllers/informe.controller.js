
import PDFDocument from 'pdfkit';
import db from '../config/db.js';

export const generarInformePDF = async (req, res) => {
  try {
    // Total de aprendices registrados
    const [aprendicesRows] = await db.query('SELECT COUNT(*) AS total FROM Aprendices');
    const totalAprendices = aprendicesRows[0].total;

    // Total de alertas generadas
    const [alertasRows] = await db.query('SELECT COUNT(*) AS total FROM alertas');
    const totalAlertas = alertasRows[0].total;

    // Top 5 aprendices con más alertas
    const [topAlertas] = await db.query(`
      SELECT ID_Aprendiz, COUNT(*) AS cantidad_alertas
      FROM alertas
      GROUP BY ID_Aprendiz
      ORDER BY cantidad_alertas DESC
      LIMIT 5
    `);

    // Fecha con más alertas registradas
    const [fechaMasAlertas] = await db.query(`
      SELECT DATE(Fecha_Alerta) AS fecha, COUNT(*) AS cantidad
      FROM alertas
      GROUP BY DATE(Fecha_Alerta)
      ORDER BY cantidad DESC
      LIMIT 1
    `);

    // Crear documento PDF
    const doc = new PDFDocument();
    const fileName = `informe-estadisticas-${Date.now()}.pdf`;

    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Contenido del PDF
    doc.fontSize(20).text('Informe de Estadísticas - SENICHECK', { align: 'center' });
    doc.moveDown();

    doc.fontSize(12).text(`📌 Total de Aprendices Registrados: ${totalAprendices}`);
    doc.text(`⚠️ Total de Alertas Generadas: ${totalAlertas}`);
    doc.moveDown();

    doc.text('👨‍🎓 Top 5 Aprendices con más Alertas:');
    topAlertas.forEach((item, index) => {
      doc.text(`${index + 1}. Aprendiz ID ${item.ID_Aprendiz} - ${item.cantidad_alertas} alertas`);
    });
    doc.moveDown();

    if (fechaMasAlertas.length > 0) {
      const fechaTop = fechaMasAlertas[0];
      doc.text(`🗓️ Fecha con más alertas: ${fechaTop.fecha} (${fechaTop.cantidad} alertas)`);
    } else {
      doc.text('No se encontraron fechas con alertas.');
    }

    // Finalizar PDF
    doc.end();

  } catch (error) {
    console.error('❌ Error al generar el PDF:', error.message);
    res.status(500).json({ mensaje: 'Error al generar el informe PDF', error });
  }
};
