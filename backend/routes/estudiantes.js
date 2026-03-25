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
