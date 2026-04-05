const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET asistencia por grupo
router.get('/grupo/:id', async (req, res) => {
  const { id } = req.params;
  const { data, error } = await supabase
    .from('asistencia')
    .select(`
      id, fecha, tipo, metodo,
      estudiantes ( id, nombre, cedula )
    `)
    .eq('grupo_id', id)
    .order('fecha', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST registrar asistencia
router.post('/', async (req, res) => {
  const { estudiante_id, grupo_id, tipo, metodo } = req.body;

  if (!estudiante_id || !grupo_id) {
    return res.status(400).json({ error: 'estudiante_id y grupo_id son obligatorios' });
  }

  const { data, error } = await supabase
    .from('asistencia')
    .insert([{
      estudiante_id,
      grupo_id,
      tipo: tipo || 'entrada',
      metodo: metodo || 'manual'
    }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;