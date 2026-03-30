const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('grupos').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { materia_id, docente, fecha_inicio, fecha_fin } = req.body;
  if (!materia_id) return res.status(400).json({ error: 'materia_id es obligatorio' });

  const { data, error } = await supabase
    .from('grupos')
    .insert([{ materia_id, docente, fecha_inicio, fecha_fin, cupo_maximo: 12, cupo_ocupado: 0 }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;