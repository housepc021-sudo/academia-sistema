const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/', async (req, res) => {
  const { data, error } = await supabase.from('materias').select('*');
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

router.post('/', async (req, res) => {
  const { nombre, descripcion, horas } = req.body;
  if (!nombre) return res.status(400).json({ error: 'nombre es obligatorio' });
  const { data, error } = await supabase
    .from('materias')
    .insert([{ nombre, descripcion, horas }])
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.status(201).json(data);
});

module.exports = router;