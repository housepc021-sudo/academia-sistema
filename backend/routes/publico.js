const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/materias', async (req, res) => {
  const { data, error } = await supabase.from('materias').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.get('/grupos', async (req, res) => {
  const { data, error } = await supabase.from('grupos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/solicitud-inscripcion', async (req, res) => {
  const { nombre, cedula, telefono, email } = req.body;
  if (!nombre || !cedula) {
    return res.status(400).json({ error: 'Nombre y cedula son obligatorios' });
  }
  const { data, error } = await supabase
    .from('estudiantes')
    .insert([{ nombre, cedula, telefono, email, estado_cuenta: 'pendiente' }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json({ mensaje: 'Solicitud recibida', id: data.id });
});

module.exports = router;