const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');
const { generarRecibo, generarConstancia } = require('../utils/generarPDF');

// GET recibo de un pago
router.get('/recibo/:pagoId', async (req, res) => {
  const { pagoId } = req.params;

  const { data: pago, error } = await supabase
    .from('pagos')
    .select(`
      id, monto, metodo, descripcion, fecha_pago,
      estudiantes ( nombre, cedula, estado_cuenta )
    `)
    .eq('id', pagoId)
    .single();

  if (error || !pago) {
    return res.status(404).json({ error: 'Pago no encontrado' });
  }

  generarRecibo(res, {
    id:            pago.id,
    estudiante:    pago.estudiantes.nombre,
    cedula:        pago.estudiantes.cedula,
    estado_cuenta: pago.estudiantes.estado_cuenta,
    monto:         pago.monto,
    metodo:        pago.metodo,
    descripcion:   pago.descripcion,
    fecha:         pago.fecha_pago,
  });
});

// GET constancia de inscripcion
router.get('/constancia/:estudianteId', async (req, res) => {
  const { estudianteId } = req.params;

  const { data: estudiante, error } = await supabase
    .from('estudiantes')
    .select('id, nombre, cedula, estado_cuenta, fecha_inscripcion')
    .eq('id', estudianteId)
    .single();

  if (error || !estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  generarConstancia(res, {
    estudiante_id:    estudiante.id,
    nombre:           estudiante.nombre,
    cedula:           estudiante.cedula,
    estado_cuenta:    estudiante.estado_cuenta,
    fecha_inscripcion: estudiante.fecha_inscripcion,
  });
});

module.exports = router;