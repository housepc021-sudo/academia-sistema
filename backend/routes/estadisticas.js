const express = require('express');
const router = express.Router();
const supabase = require('../supabaseClient');

router.get('/', async (req, res) => {
  const [
    { count: totalEstudiantes },
    { count: totalGrupos },
    { count: totalInscripciones },
    { data: pagos },
    { count: accesosHoy },
    { count: estudiantesAlDia },
    { count: estudiantesBloqueados },
  ] = await Promise.all([
    supabase.from('estudiantes').select('*', { count: 'exact', head: true }),
    supabase.from('grupos').select('*', { count: 'exact', head: true }),
    supabase.from('inscripciones').select('*', { count: 'exact', head: true }).eq('estado', 'activa'),
    supabase.from('pagos').select('monto'),
    supabase.from('acceso_log').select('*', { count: 'exact', head: true })
      .gte('created_at', new Date().toISOString().split('T')[0]),
    supabase.from('estudiantes').select('*', { count: 'exact', head: true }).eq('estado_cuenta', 'al_dia'),
    supabase.from('estudiantes').select('*', { count: 'exact', head: true }).eq('estado_cuenta', 'bloqueado'),
  ]);

  const totalRecaudado = pagos?.reduce((acc, p) => acc + Number(p.monto), 0) || 0;

  res.json({
    totalEstudiantes: totalEstudiantes || 0,
    totalGrupos: totalGrupos || 0,
    totalInscripciones: totalInscripciones || 0,
    totalRecaudado,
    accesosHoy: accesosHoy || 0,
    estudiantesAlDia: estudiantesAlDia || 0,
    estudiantesBloqueados: estudiantesBloqueados || 0,
  });
});

module.exports = router;