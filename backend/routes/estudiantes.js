const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET /api/estudiantes — listar todos
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('estudiantes')
    .select('*')
    .order('id', { ascending: true });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// GET /api/estudiantes/:id — obtener uno
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('estudiantes')
    .select('*')
    .eq('id', id)
    .single();

  if (error) return res.status(404).json({ error: 'Estudiante no encontrado' });
  res.json(data);
});

// POST /api/estudiantes — crear nuevo
router.post('/', async (req, res) => {
  const { nombre, cedula, telefono, email } = req.body;

  if (!nombre || !cedula) {
    return res.status(400).json({ error: 'Nombre y cedula son obligatorios' });
  }

  const { data, error } = await supabase
    .from('estudiantes')
    .insert([{ nombre, cedula, telefono, email }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;

// PATCH /api/estudiantes/:id — actualizar estudiante
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { nombre, cedula, telefono, email } = req.body;

  const { data, error } = await supabase
    .from('estudiantes')
    .update({ nombre, cedula, telefono, email })
    .eq('id', id)
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// DELETE /api/estudiantes/:id — eliminar estudiante
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase
    .from('estudiantes')
    .delete()
    .eq('id', id);

  if (error) return res.status(500).json({ error: error.message });
  res.json({ message: 'Estudiante eliminado' });
});

router.get('/:id/estado-cuenta', async (req, res) => {
    const { id } = req.params;

// consultamos los pagos realizados por el estudiante
    const {data: estudiante,error: errorEst} = await supabase
    .from('estudiantes')
    .select('*')
    .eq('id', id)
    .single ();
      if (errorEst) return res.status(500).json({ error: errorEst.message });

  // rescatamos los pagos realizados por el estudiante
  const { data: pagos, error: errorPagos } = await supabase
    .from('pagos')
    .select('monto')
    .eq('estudiante_id', id);

  if (errorPagos) return res.status(500).json({ error: errorPagos.message });

  // suma de los pagos realizados
  const totalPagado = pagos.reduce((acc, p) => acc + Number(p.monto), 0);

  // Calculo de los meses desde inscripción
  const fechaInicio = new Date(estudiante.fecha_inscripcion);
  const hoy = new Date();

  let meses = (hoy.getFullYear() - fechaInicio.getFullYear()) * 12 +
            (hoy.getMonth() - fechaInicio.getMonth());

    meses = meses + 1;

  const mensualidad = 50;
  const totalDeberia = meses * mensualidad;
  
  const deuda = totalDeberia - totalPagado;
  const deudaFinal = Math.max(0, deuda);
  const saldo_favor = deuda < 0 ? Math.abs(deuda) : 0;

  res.json({
    estudiante: estudiante.nombre,
    total_pagado: totalPagado,
    total_deberia: totalDeberia,
    deuda: deudaFinal,
    saldo_favor: saldo_favor,
    estado: deuda <= 0 ? 'al_dia' : 'debe'
  });
});