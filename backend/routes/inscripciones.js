const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

// GET todas las inscripciones
router.get('/', async (req, res) => {
  const { data, error } = await supabase
    .from('inscripciones')
    .select(`
      id,
      modalidad,
      estado,
      fecha_inscripcion,
      estudiantes ( id, nombre, cedula ),
      grupos ( id, cupo_maximo, cupo_ocupado, docente,
        materias ( nombre )
      )
    `)
    .order('id', { ascending: false });

  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

// POST crear inscripcion
router.post('/', async (req, res) => {
  const { estudiante_id, grupo_id, modalidad } = req.body;

  if (!estudiante_id || !grupo_id) {
    return res.status(400).json({ error: 'estudiante_id y grupo_id son obligatorios' });
  }

  // Verificar cupo disponible
  const { data: grupo, error: errorGrupo } = await supabase
    .from('grupos')
    .select('cupo_maximo, cupo_ocupado')
    .eq('id', grupo_id)
    .single();

  if (errorGrupo) return res.status(500).json({ error: errorGrupo.message });

  if (grupo.cupo_ocupado >= grupo.cupo_maximo) {
    return res.status(400).json({ error: 'El grupo no tiene cupos disponibles' });
  }

  // Verificar que el estudiante no esté ya inscrito en ese grupo
  const { data: existente } = await supabase
    .from('inscripciones')
    .select('id')
    .eq('estudiante_id', estudiante_id)
    .eq('grupo_id', grupo_id)
    .single();

  if (existente) {
    return res.status(400).json({ error: 'El estudiante ya está inscrito en este grupo' });
  }

  // Crear inscripcion
  const { data, error } = await supabase
    .from('inscripciones')
    .insert([{ estudiante_id, grupo_id, modalidad: modalidad || 'curso_corto' }])
    .select()
    .single();

  if (error) return res.status(500).json({ error: error.message });

  // Actualizar cupo ocupado
  await supabase
    .from('grupos')
    .update({ cupo_ocupado: grupo.cupo_ocupado + 1 })
    .eq('id', grupo_id);

  res.status(201).json(data);
});

// PATCH cancelar inscripcion
router.patch('/:id/cancelar', async (req, res) => {
  const { id } = req.params;

  const { data: inscripcion } = await supabase
    .from('inscripciones')
    .select('grupo_id')
    .eq('id', id)
    .single();

  if (!inscripcion) return res.status(404).json({ error: 'Inscripcion no encontrada' });

  await supabase
    .from('inscripciones')
    .update({ estado: 'cancelada' })
    .eq('id', id);

  const { data: grupo } = await supabase
    .from('grupos')
    .select('cupo_ocupado')
    .eq('id', inscripcion.grupo_id)
    .single();

  await supabase
    .from('grupos')
    .update({ cupo_ocupado: Math.max(0, grupo.cupo_ocupado - 1) })
    .eq('id', inscripcion.grupo_id);

  res.json({ mensaje: 'Inscripcion cancelada' });
});

module.exports = router;