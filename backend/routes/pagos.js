const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.post('/', async (req, res) => {
  const { estudiante_id, monto, metodo, descripcion } = req.body;

  if (!estudiante_id || !monto) {
    return res.status(400).json({ error: 'estudiante_id y monto son obligatorios' });
  }

  // 1. Registrar el pago
  const { data: pago, error: errorPago } = await supabase
    .from('pagos')
    .insert([{ estudiante_id, monto, metodo, descripcion }])
    .select()
    .single();

  if (errorPago) return res.status(500).json({ error: errorPago.message });

  // 2. Sumar todos los pagos del estudiante
  const { data: pagos, error: errorPagos } = await supabase
    .from('pagos')
    .select('monto')
    .eq('estudiante_id', estudiante_id);

  if (errorPagos) return res.status(500).json({ error: errorPagos.message });

  const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

  // 3. Obtener fecha de inscripcion
  const { data: estudiante } = await supabase
    .from('estudiantes')
    .select('fecha_inscripcion')
    .eq('id', estudiante_id)
    .single();

  const fechaInicio = new Date(estudiante.fecha_inscripcion);
  const hoy = new Date();
  let meses = (hoy.getFullYear() - fechaInicio.getFullYear()) * 12 +
              (hoy.getMonth() - fechaInicio.getMonth()) + 1;

  const totalDeberia = meses * 50;
  const nuevoEstado = totalPagado >= totalDeberia ? 'al_dia' : 'bloqueado';

  // 4. Actualizar estado_cuenta del estudiante
  await supabase
    .from('estudiantes')
    .update({ estado_cuenta: nuevoEstado })
    .eq('id', estudiante_id);

  res.status(201).json({
    pago,
    estado_cuenta_actualizado: nuevoEstado
  });
});

module.exports = router;