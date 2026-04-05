const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// POST /api/acceso/validar
// Este es el endpoint que llamará el biométrico Hikvision
router.post('/validar', async (req, res) => {
  const { cedula } = req.body;

  if (!cedula) {
    return res.status(400).json({ acceso: 'denegado', mensaje: 'Cedula requerida' });
  }

  // Buscar estudiante por cedula
  const { data: estudiante, error } = await supabase
    .from('estudiantes')
    .select('id, nombre, estado_cuenta')
    .eq('cedula', cedula)
    .single();

  if (error || !estudiante) {
    return res.status(404).json({ acceso: 'denegado', mensaje: 'Estudiante no encontrado' });
  }

  // Verificar estado de cuenta
  if (estudiante.estado_cuenta !== 'al_dia') {
    // Registrar intento fallido
    await supabase.from('acceso_log').insert([{
      estudiante_id: estudiante.id,
      resultado: 'denegado',
      motivo: 'pago_pendiente'
    }]);

    return res.status(200).json({
      acceso: 'denegado',
      mensaje: `Acceso denegado. ${estudiante.nombre} tiene pagos pendientes.`
    });
  }

  // Registrar acceso exitoso y asistencia
  await supabase.from('acceso_log').insert([{
    estudiante_id: estudiante.id,
    resultado: 'permitido',
    motivo: null
  }]);

  await supabase.from('asistencia').insert([{
    estudiante_id: estudiante.id,
    grupo_id: null,
    tipo: 'entrada',
    metodo: 'biometrico'
  }]);

  return res.status(200).json({
    acceso: 'permitido',
    mensaje: `Bienvenida, ${estudiante.nombre}`
  });
});

// GET /api/acceso/log — historial de accesos
router.get('/log', async (req, res) => {
  const { data, error } = await supabase
    .from('acceso_log')
    .select(`
      id, resultado, motivo, created_at,
      estudiantes ( nombre, cedula )
    `)
    .order('created_at', { ascending: false })
    .limit(50);

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

module.exports = router;