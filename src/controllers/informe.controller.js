import PDFDocument from 'pdfkit';
import fs from 'fs';
import db from '../config/db.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Para usar __dirname en ESModules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===============================
   🔹 Informe general (estadísticas globales en PDF)
   =============================== */
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

    doc.fontSize(26).fillColor('#39A900').text('SENICHECK', { align: 'center', underline: true });
    doc.moveDown(0.5).fontSize(18).fillColor('black').text('Informe de Estadísticas', { align: 'center' });

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

/* ===============================
   🔧 Utilidades comunes
   =============================== */
const DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes'];
const isPresent = (v) => v === 'Sí asistió' || v === 'Justificada';
const isAbsent  = (v) => v === 'No asistió' || v === 'No justificada';

const parseToDate = (raw) => {
  if (!raw) return null;
  try {
    const d = raw instanceof Date ? raw : new Date(raw);
    return isNaN(d.getTime()) ? null : d;
  } catch { return null; }
};
const monthKey = (d) => d ? `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}` : null;
const quarter  = (d) => d ? `Q${Math.floor(d.getMonth()/3)+1}-${d.getFullYear()}` : null;

/* ===============================
   🔹 PDF POR FICHA (robusto sin Fecha / Fecha_Semana / ID_Asistencia)
   =============================== */
export const generarInformePorFicha = async (req, res) => {
  const fichaId = req.params.id;

  try {
    const [[ficha]] = await db.query(`
      SELECT f.ID_Ficha, f.Nombre_Ficha 
      FROM fichas_de_formacion f 
      WHERE f.ID_Ficha = ?
    `, [fichaId]);

    if (!ficha) return res.status(404).json({ mensaje: 'Ficha no encontrada' });

    const [aprendices] = await db.query(`
      SELECT a.ID_Aprendiz, a.Nombre, a.Apellido
      FROM aprendices a
      WHERE a.ID_Ficha = ?
      ORDER BY a.Apellido, a.Nombre
    `, [fichaId]);

    // Detectar columnas disponibles en 'asistencia'
    const [cols] = await db.query(`SHOW COLUMNS FROM asistencia`);
    const hasFecha        = cols.some(c => c.Field === 'Fecha');
    const hasFechaSemana  = cols.some(c => c.Field === 'Fecha_Semana');
    const hasIdAsistencia = cols.some(c => c.Field === 'ID_Asistencia');

    const fechaSelect = [
      hasFecha ? 'asi.Fecha AS Fecha' : 'NULL AS Fecha',
      hasFechaSemana ? 'asi.Fecha_Semana AS Fecha_Semana' : 'NULL AS Fecha_Semana'
    ].join(', ');

    const orderBy = hasIdAsistencia
      ? 'ORDER BY ap.ID_Aprendiz, asi.ID_Asistencia ASC'
      : 'ORDER BY ap.ID_Aprendiz ASC';

    const [asistencias] = await db.query(`
      SELECT ap.ID_Aprendiz, ap.Nombre, ap.Apellido,
             asi.Lunes, asi.Martes, asi.Miércoles, asi.Jueves, asi.Viernes,
             ${fechaSelect}
      FROM asistencia asi
      JOIN aprendices ap ON asi.ID_Aprendiz = ap.ID_Aprendiz
      WHERE ap.ID_Ficha = ?
      ${orderBy}
    `, [fichaId]);

    // Estructuras de agregación
    const byAprendiz = new Map();     // id -> { nombre, semanas:[{semanaIdx, date, dias, pres, aus}], totalAbs }
    const resumenSemana = [];         // idx -> { presentes, ausentes, total }
    const resumenMes = new Map();     // 'YYYY-MM' -> { presentes, ausentes, total }
    const resumenTrimestre = new Map(); // 'Qn-YYYY' -> { presentes, ausentes, total }

    // Inicializar por si un aprendiz no tiene asistencias
    for (const ap of aprendices) {
      byAprendiz.set(ap.ID_Aprendiz, {
        nombre: `${ap.Nombre} ${ap.Apellido}`,
        semanas: [],
        totalAbs: 0,
        totalPres: 0, 
      });
    }

    const semanaIndexPorAprendiz = {};
    for (const row of asistencias) {
      const entry = byAprendiz.get(row.ID_Aprendiz) || {
        nombre: `${row.Nombre} ${row.Apellido}`,
        semanas: [],
        totalAbs: 0,
      };

      const weekIdx = (semanaIndexPorAprendiz[row.ID_Aprendiz] ?? 0) + 1;
      semanaIndexPorAprendiz[row.ID_Aprendiz] = weekIdx;

      const dias = {};
      let pres = 0, aus = 0;
      DAYS.forEach((d) => {
        const val = row[d];
        dias[d] = val ?? '-';
        if (isPresent(val)) pres += 1;
        else if (isAbsent(val)) aus += 1;
      });

      const dateRef = parseToDate(row.Fecha) || parseToDate(row.Fecha_Semana) || null;

      entry.semanas.push({ semanaIdx: weekIdx, date: dateRef, dias, pres, aus });
      entry.totalAbs += aus;
      entry.totalPres += pres; 
      byAprendiz.set(row.ID_Aprendiz, entry);

      if (!resumenSemana[weekIdx - 1]) resumenSemana[weekIdx - 1] = { presentes: 0, ausentes: 0, total: 0 };
      resumenSemana[weekIdx - 1].presentes += pres;
      resumenSemana[weekIdx - 1].ausentes  += aus;
      resumenSemana[weekIdx - 1].total     += (pres + aus);

      if (dateRef) {
        const mk = monthKey(dateRef);
        if (mk) {
          const cur = resumenMes.get(mk) || { presentes: 0, ausentes: 0, total: 0 };
          cur.presentes += pres; cur.ausentes += aus; cur.total += (pres + aus);
          resumenMes.set(mk, cur);
        }
        const qk = quarter(dateRef);
        if (qk) {
          const cur = resumenTrimestre.get(qk) || { presentes: 0, ausentes: 0, total: 0 };
          cur.presentes += pres; cur.ausentes += aus; cur.total += (pres + aus);
          resumenTrimestre.set(qk, cur);
        }
      }
    }

    // ====== PDF ======
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    const fileName = `informe-ficha-${fichaId}.pdf`;

    res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
    res.setHeader('Content-Type', 'application/pdf');
    doc.pipe(res);

    // Encabezado
    doc.fontSize(20).fillColor('#39A900').text('SENICHECK - Informe por Ficha', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).fillColor('black');
    doc.text(`Ficha: ${ficha.Nombre_Ficha} (ID: ${ficha.ID_Ficha})`);
    doc.text(`Total de aprendices: ${aprendices.length}`);
    doc.moveDown(1);

    // Helpers dibujo
    const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    const startX = doc.page.margins.left;
    let y = doc.y;

    const drawHeader = (title, color = '#00304D') => {
      doc.fontSize(14).fillColor(color).text(title, startX, y);
      y = doc.y + 6;
    };
    const ensureSpace = (needed = 60) => {
      if (y + needed > doc.page.height - doc.page.margins.bottom) {
        doc.addPage(); y = doc.page.margins.top;
      }
    };
    const drawTableHeader = (cols) => {
      doc.fontSize(11).fillColor('black');
      let x = startX;
      cols.forEach(c => { doc.text(c.label, x, y, { width: c.w }); x += c.w; });
      y += 18;
      doc.moveTo(startX, y).lineTo(startX + pageWidth, y).strokeColor('#CCCCCC').stroke();
      y += 6;
    };
    const drawRow = (cols, values, color = 'black') => {
      ensureSpace(20);
      doc.fillColor(color).fontSize(10);
      let x = startX;
      cols.forEach((c, idx) => { doc.text(String(values[idx] ?? ''), x, y, { width: c.w }); x += c.w; });
      y += 16;
      doc.fillColor('black');
    };

   const colsAsist = [
  { label: 'Semana',     w: 70 },
  { label: 'Lun',        w: 55 },
  { label: 'Mar',        w: 55 },
  { label: 'Mié',        w: 65 },
  { label: 'Jue',        w: 55 },
  { label: 'Vie',        w: 55 },
  { label: 'Pres',       w: 40 },
  { label: 'Aus',        w: 40 },
];



    // Por aprendiz: nombre (rojo si ≥3 inasistencias) + tabla L–V por semana
    for (const ap of aprendices) {
      const info = byAprendiz.get(ap.ID_Aprendiz) || {
        nombre: `${ap.Nombre} ${ap.Apellido}`, semanas: [], totalAbs: 0,
      };
      ensureSpace(80);
      const colorNombre = info.totalAbs >= 3 ? '#B00020' : '#000000';
      doc.fontSize(13).fillColor(colorNombre).text(`Aprendiz: ${info.nombre}`);
      y = doc.y + 6;

      drawTableHeader(colsAsist);

      if (info.semanas.length === 0) {
        drawRow(colsAsist, ['–','–','–','–','–','–',0,0]);
        y += 6;
      } else {
        info.semanas.forEach((s) => {
          const label = s.date ? `Semana ${s.semanaIdx} (${s.date.toISOString().slice(0,10)})` : `Semana ${s.semanaIdx}`;
          drawRow(colsAsist, [label, s.dias.Lunes, s.dias.Martes, s.dias.Miércoles, s.dias.Jueves, s.dias.Viernes, s.presentes, s.ausentes]);
        });
        y += 6;
      }
      doc.moveTo(startX, y).lineTo(startX + pageWidth, y).strokeColor('#E0E0E0').stroke();
      y += 10;
    }

    // Resúmenes
    const colsRes = [
      { label: 'Periodo',   w: 120 },
      { label: 'asistencias', w: 100 },
      { label: 'inasistencias',  w: 100 },
      { label: '% Asistencia', w: 120 },
    ];

    ensureSpace(60);

    drawHeader('Resumen por Aprendiz');
const colsApr = [
  { label: 'Aprendiz',       w: 220 },
  { label: 'Presentes',      w: 90  },
  { label: 'Ausentes',       w: 90  },
  { label: '% Asistencia',   w: 90  },
];
drawTableHeader(colsApr);

// recorremos en el mismo orden de 'aprendices'
for (const ap of aprendices) {
  const info = byAprendiz.get(ap.ID_Aprendiz) || { nombre: `${ap.Nombre} ${ap.Apellido}`, totalPres: 0, totalAbs: 0 };
  const pres = info.totalPres || 0;
  const aus  = info.totalAbs  || 0;
  const total = pres + aus || 1;
  const pct = Math.round((pres / total) * 100);
  drawRow(colsApr, [info.nombre, pres, aus, `${pct}%`]);
}
    drawHeader('Resumen por Semana');
    drawTableHeader(colsRes);
    resumenSemana.forEach((r, i) => {
      const pct = r?.total ? Math.round((r.presentes / r.total) * 100) : 0;
      drawRow(colsRes, [`Semana ${i+1}`, r?.presentes ?? 0, r?.ausentes ?? 0, `${pct}%`]);
    });

    if (resumenMes.size > 0) {
      ensureSpace(60);
      drawHeader('Resumen por Mes');
      drawTableHeader(colsRes);
      Array.from(resumenMes.keys()).sort().forEach(k => {
        const r = resumenMes.get(k);
        const pct = r.total ? Math.round((r.presentes / r.total) * 100) : 0;
        drawRow(colsRes, [k, r.presentes, r.ausentes, `${pct}%`]);
      });
    }

    if (resumenTrimestre.size > 0) {
      ensureSpace(60);
      drawHeader('Resumen por Trimestre');
      drawTableHeader(colsRes);
      const keys = Array.from(resumenTrimestre.keys()).sort((a,b) => {
        const [qA,yA] = a.split('-'); const [qB,yB] = b.split('-');
        const nA = Number(yA)*10 + Number(qA.replace('Q',''));
        const nB = Number(yB)*10 + Number(qB.replace('Q',''));
        return nA - nB;
      });
      keys.forEach(k => {
        const r = resumenTrimestre.get(k);
        const pct = r.total ? Math.round((r.presentes / r.total) * 100) : 0;
        drawRow(colsRes, [k, r.presentes, r.ausentes, `${pct}%`]);
      });
    }

    doc.end();
  } catch (error) {
    console.error('❌ Error al generar informe por ficha:', error);
    res.status(500).json({ mensaje: 'Error al generar informe por ficha', error: error.message });
  }
};

/* ===============================
   🔹 Preview JSON por ficha (para el modal del frontend)
   =============================== */
export const obtenerInformeFichaPreview = async (req, res) => {
  const fichaId = req.params.id;

  try {
    const [[ficha]] = await db.query(`
      SELECT f.ID_Ficha, f.Nombre_Ficha 
      FROM fichas_de_formacion f 
      WHERE f.ID_Ficha = ?
    `, [fichaId]);

    if (!ficha) return res.status(404).json({ mensaje: 'Ficha no encontrada' });

    const [aprendices] = await db.query(`
      SELECT a.ID_Aprendiz, a.Nombre, a.Apellido
      FROM aprendices a
      WHERE a.ID_Ficha = ?
      ORDER BY a.Apellido, a.Nombre
    `, [fichaId]);

    // Detectar columnas y ordenar de forma segura
    const [cols] = await db.query(`SHOW COLUMNS FROM asistencia`);
    const hasIdAsistencia = cols.some(c => c.Field === 'ID_Asistencia');

    const orderBy = hasIdAsistencia
      ? 'ORDER BY ap.ID_Aprendiz, asi.ID_Asistencia ASC'
      : 'ORDER BY ap.ID_Aprendiz ASC';

    const [asistencias] = await db.query(`
      SELECT ap.ID_Aprendiz, ap.Nombre, ap.Apellido,
             asi.Lunes, asi.Martes, asi.Miércoles, asi.Jueves, asi.Viernes
      FROM asistencia asi
      JOIN aprendices ap ON asi.ID_Aprendiz = ap.ID_Aprendiz
      WHERE ap.ID_Ficha = ?
      ${orderBy}
    `, [fichaId]);

    if (asistencias.length === 0) {
      return res.json({
        ficha: { id: ficha.ID_Ficha, nombre: ficha.Nombre_Ficha, totalAprendices: aprendices.length },
        resumen: { totalSemanas: 0, presentes: 0, ausentes: 0, porcentajeAsistencia: 0 },
        detalle: []
      });
    }

    // Agregación por "semana" (índice de registro por aprendiz)
    let totalPres = 0, totalAus = 0;
    const semanasAgg = []; // idx -> {presentes, ausentes, total}
    const indicePorAprendiz = {};

    asistencias.forEach(row => {
      const idx = (indicePorAprendiz[row.ID_Aprendiz] ?? 0);
      indicePorAprendiz[row.ID_Aprendiz] = idx + 1;

      let p = 0, a = 0;
      DAYS.forEach(d => {
        const v = row[d];
        if (isPresent(v)) p++;
        else if (isAbsent(v)) a++;
      });

      totalPres += p; totalAus += a;

      if (!semanasAgg[idx]) semanasAgg[idx] = { presentes: 0, ausentes: 0, total: 0 };
      semanasAgg[idx].presentes += p;
      semanasAgg[idx].ausentes  += a;
      semanasAgg[idx].total     += (p + a);
    });

    const detalle = semanasAgg.map((s, i) => {
      const pct = s.total ? Math.round((s.presentes / s.total) * 100) : 0;
      return {
        semana: `Semana ${i + 1}`,
        presentes: s.presentes,
        ausentes: s.ausentes,
        porcentaje: `${pct}%`
      };
    });

    const totalReg = totalPres + totalAus || 1;
    const resumen = {
      totalSemanas: detalle.length,
      presentes: totalPres,
      ausentes: totalAus,
      porcentajeAsistencia: Number(((totalPres / totalReg) * 100).toFixed(1))
    };

    res.json({
      ficha: { id: ficha.ID_Ficha, nombre: ficha.Nombre_Ficha, totalAprendices: aprendices.length },
      resumen,
      detalle
    });
  } catch (error) {
    console.error('❌ Error en obtenerInformeFichaPreview:', error);
    res.status(500).json({ mensaje: 'Error generando preview del informe.' });
  }
};

/* ===============================
   🔹 Informe por aprendiz (PDF)
   =============================== */
export const generarInformePorAprendiz = async (req, res) => {
  const idAprendiz = req.params.id;

  try {
    const [[aprendiz]] = await db.query(`
      SELECT ap.Nombre, ap.Apellido, f.Nombre_Ficha, f.ID_Ficha
      FROM aprendices ap
      JOIN fichas_de_formacion f ON ap.ID_Ficha = f.ID_Ficha
      WHERE ap.ID_Aprendiz = ?
    `, [idAprendiz]);

    if (!aprendiz) return res.status(404).json({ mensaje: 'Aprendiz no encontrado' });

    const [asistencias] = await db.query(`
      SELECT Lunes, Martes, Miércoles, Jueves, Viernes
      FROM asistencia
      WHERE ID_Aprendiz = ?
    `, [idAprendiz]);

    const [alertas] = await db.query(`
      SELECT DATE(Fecha_Alerta) AS fecha, Estado
      FROM alertas
      WHERE ID_Aprendiz = ?
    `, [idAprendiz]);

    const [intervenciones] = await db.query(`
      SELECT Tipo_Intervencion, Fecha_Intervencion, Resultado
      FROM intervenciones
      WHERE ID_Aprendiz = ?
    `, [idAprendiz]);

    const [planes] = await db.query(`
      SELECT Tipo_Seguimiento, Fecha_Inicio, Fecha_Fin, Estado, Descripcion
      FROM planes_seguimiento
      WHERE ID_Aprendiz = ?
      ORDER BY Fecha_Inicio DESC LIMIT 1
    `, [idAprendiz]);

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

    doc.fontSize(14).text('Registro de Asistencia:', { underline: true });
    if (asistencias.length > 0) {
      asistencias.forEach((a, i) => {
        doc.fontSize(11).text(`Semana ${i + 1}: [${a.Lunes}, ${a.Martes}, ${a.Miércoles}, ${a.Jueves}, ${a.Viernes}]`);
      });
    } else {
      doc.text('No se encontraron registros de asistencia.');
    }

    doc.moveDown();

    doc.fontSize(14).text('Alertas Generadas:', { underline: true });
    if (alertas.length > 0) {
      alertas.forEach(a => {
        doc.fontSize(11).text(`• ${a.fecha} - Estado: ${a.Estado}`);
      });
    } else {
      doc.text('Sin alertas registradas.');
    }

    doc.moveDown();

    doc.fontSize(14).text('Intervenciones Realizadas:', { underline: true });
    if (intervenciones.length > 0) {
      intervenciones.forEach(i => {
        doc.fontSize(11).text(`• ${i.Fecha_Intervencion} - ${i.Tipo_Intervencion} (${i.Resultado})`);
      });
    } else {
      doc.text('No hay intervenciones registradas.');
    }

    doc.moveDown();

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

/* ===============================
   🔹 Resumen estadístico en JSON
   =============================== */
export const obtenerResumenEstadisticas = async (req, res) => {
  try {
    const [aprendicesRows] = await db.query('SELECT COUNT(*) AS total FROM Aprendices');
    const totalAprendices = aprendicesRows[0].total;

    const [alertasRows] = await db.query('SELECT COUNT(*) AS total FROM alertas');
    const totalAlertas = alertasRows[0].total;

    const [fichasRows] = await db.query('SELECT COUNT(*) AS total FROM fichas_de_formacion');
    const totalFichas = fichasRows[0].total;

    const [topAlertas] = await db.query(`
      SELECT ID_Aprendiz AS idAprendiz, COUNT(*) AS cantidad
      FROM alertas
      GROUP BY ID_Aprendiz
      ORDER BY cantidad DESC
      LIMIT 5
    `);

    const [fechaMasAlertas] = await db.query(`
      SELECT DATE(Fecha_Alerta) AS fecha, COUNT(*) AS cantidad
      FROM alertas
      GROUP BY DATE(Fecha_Alerta)
      ORDER BY cantidad DESC
      LIMIT 1
    `);

    const [fichaMasAlertas] = await db.query(`
      SELECT f.ID_Ficha, f.Nombre_Ficha, COUNT(*) AS total_alertas
      FROM alertas a
      JOIN aprendices ap ON a.ID_Aprendiz = ap.ID_Aprendiz
      JOIN fichas_de_formacion f ON ap.ID_Ficha = f.ID_Ficha
      GROUP BY ap.ID_Ficha
      ORDER BY total_alertas DESC
      LIMIT 1
    `);

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
        conteo[a.ID_Aprendiz] = { nombre: `${a.Nombre} ${a.Apellido}`, total };
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

    const [totalAsistencia] = await db.query(`SELECT Lunes, Martes, Miércoles, Jueves, Viernes FROM asistencia`);

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

/* ===============================
   🔹 Informe institucional en PDF
   =============================== */
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

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'inline; filename=reporte_inasistencia_institucional.pdf');

    doc.pipe(res);

    doc.fontSize(18).text('📋 Reporte Institucional de Inasistencias', { align: 'center' });
    doc.moveDown(1);

    const tableTop = 100;
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
      doc.fillColor('black');
      doc.text(index + 1, 50, y);
      doc.text(fila.NombreAprendiz, 80, y);
      doc.text(fila.Nombre_Ficha, 200, y);
      doc.text(fila.EstadoAprendiz, 300, y);
      doc.text(fila.EstadoFicha, 380, y);

      if (fila.TotalInasistencias > 0) doc.fillColor('red'); else doc.fillColor('green');
      doc.text(String(fila.TotalInasistencias), 470, y);
      y += rowHeight;
    });

    doc.end();
  } catch (error) {
    console.error('Error al generar el informe institucional:', error);
    res.status(500).json({ mensaje: 'Error al generar el informe institucional', error: error.message });
  }
};
