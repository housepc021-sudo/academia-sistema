const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const supabase = require('../supabaseClient');

// POST /api/auth/register
router.post('/register', async (req, res) => {
  const { nombre, email, password, rol } = req.body;

  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'nombre, email y password son obligatorios' });
  }

  const password_hash = await bcrypt.hash(password, 10);

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, email, password_hash, rol: rol || 'estudiante' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  res.status(201).json({ mensaje: 'Usuario creado', usuario: { id: data.id, nombre: data.nombre, rol: data.rol } });
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'email y password son obligatorios' });
  }

  const { data: usuario, error } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email)
    .single();

  if (error || !usuario) {
    return res.status(401).json({ error: 'Credenciales invalidas' });
  }

  const passwordValido = await bcrypt.compare(password, usuario.password_hash);

  if (!passwordValido) {
    return res.status(401).json({ error: 'Credenciales invalidas' });
  }

  const token = jwt.sign(
    { id: usuario.id, rol: usuario.rol },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

  res.json({ token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } });
});

module.exports = router;