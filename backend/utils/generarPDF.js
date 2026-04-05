const PDFDocument = require('pdfkit');

const generarRecibo = (res, datos) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=recibo-${datos.id}.pdf`);

  doc.pipe(res);

  // Encabezado
  doc.fontSize(20).font('Helvetica-Bold').text('Academia de Moda', { align: 'center' });
  doc.fontSize(12).font('Helvetica').text('Recibo de Pago', { align: 'center' });
  doc.moveDown();

  // Linea separadora
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Datos del recibo
  doc.fontSize(12).font('Helvetica-Bold').text('Datos del pago:');
  doc.moveDown(0.5);

  doc.font('Helvetica').fontSize(11);
  doc.text(`Recibo N°:        ${datos.id}`);
  doc.text(`Estudiante:       ${datos.estudiante}`);
  doc.text(`Cédula:           ${datos.cedula}`);
  doc.text(`Monto:            $${datos.monto}`);
  doc.text(`Método de pago:   ${datos.metodo}`);
  doc.text(`Descripción:      ${datos.descripcion || 'Pago de mensualidad'}`);
  doc.text(`Fecha:            ${datos.fecha}`);
  doc.moveDown();

  // Linea separadora
  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Estado
  doc.fontSize(12).font('Helvetica-Bold').text('Estado de cuenta:');
  doc.font('Helvetica').fontSize(11);
  doc.text(`Estado actual:    ${datos.estado_cuenta === 'al_dia' ? 'Al día' : 'Pendiente'}`);
  doc.moveDown(2);

  // Pie de página
  doc.fontSize(10).font('Helvetica').fillColor('gray')
    .text('Este documento es un comprobante oficial de pago.', { align: 'center' });
  doc.text('Academia de Moda — Sistema de Gestión', { align: 'center' });

  doc.end();
};

const generarConstancia = (res, datos) => {
  const doc = new PDFDocument({ margin: 50 });

  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename=constancia-${datos.estudiante_id}.pdf`);

  doc.pipe(res);

  // Encabezado
  doc.fontSize(20).font('Helvetica-Bold').text('Academia de Moda', { align: 'center' });
  doc.fontSize(12).font('Helvetica').text('Constancia de Inscripción', { align: 'center' });
  doc.moveDown();

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown();

  // Cuerpo
  doc.fontSize(12).font('Helvetica');
  doc.text('Por medio de la presente se hace constar que:');
  doc.moveDown();

  doc.font('Helvetica-Bold').fontSize(14)
    .text(datos.nombre, { align: 'center' });
  doc.font('Helvetica').fontSize(12);
  doc.text(`Cédula: ${datos.cedula}`, { align: 'center' });
  doc.moveDown();

  doc.text('Se encuentra debidamente inscrito/a en esta institución.');
  doc.moveDown(0.5);
  doc.text(`Estado de cuenta: ${datos.estado_cuenta === 'al_dia' ? 'Al día' : 'Pendiente'}`);
  doc.text(`Fecha de inscripción: ${datos.fecha_inscripcion}`);
  doc.moveDown(2);

  doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
  doc.moveDown(2);

  // Firma
  doc.text('_______________________________', { align: 'center' });
  doc.text('Firma y sello de la institución', { align: 'center' });
  doc.moveDown();

  doc.fontSize(10).fillColor('gray')
    .text(`Documento generado el ${new Date().toLocaleDateString()}`, { align: 'center' });

  doc.end();
};

module.exports = { generarRecibo, generarConstancia };