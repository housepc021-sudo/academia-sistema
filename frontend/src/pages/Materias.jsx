import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Materias() {
  const { token } = useAuth();
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [formMateria, setFormMateria] = useState({ nombre: '', descripcion: '', horas: '' });
  const [formGrupo, setFormGrupo] = useState({ materia_id: '', docente: '', fecha_inicio: '', fecha_fin: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const cargarDatos = async () => {
    const [m, g] = await Promise.all([
      axios.get('http://localhost:3000/api/materias', { headers }),
      axios.get('http://localhost:3000/api/grupos', { headers })
    ]);
    setMaterias(m.data);
    setGrupos(g.data);
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleMateria = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/api/materias', {
        ...formMateria,
        horas: parseInt(formMateria.horas)
      }, { headers });
      setExito('Materia creada');
      setFormMateria({ nombre: '', descripcion: '', horas: '' });
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch {
      setError('Error al crear materia');
    }
  };

  const handleGrupo = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post('http://localhost:3000/api/grupos', {
        ...formGrupo,
        materia_id: parseInt(formGrupo.materia_id)
      }, { headers });
      setExito('Grupo creado');
      setFormGrupo({ materia_id: '', docente: '', fecha_inicio: '', fecha_fin: '' });
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch {
      setError('Error al crear grupo');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Materias y Grupos</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {exito && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{exito}</div>}

      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-700 mb-4">Nueva materia</h3>
          <form onSubmit={handleMateria} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre</label>
              <input
                value={formMateria.nombre}
                onChange={e => setFormMateria({ ...formMateria, nombre: e.target.value })}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Descripción</label>
              <input
                value={formMateria.descripcion}
                onChange={e => setFormMateria({ ...formMateria, descripcion: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Horas</label>
              <input
                type="number"
                value={formMateria.horas}
                onChange={e => setFormMateria({ ...formMateria, horas: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 transition">
              Crear materia
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-700 mb-4">Nuevo grupo</h3>
          <form onSubmit={handleGrupo} className="space-y-3">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Materia</label>
              <select
                value={formGrupo.materia_id}
                onChange={e => setFormGrupo({ ...formGrupo, materia_id: e.target.value })}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Seleccionar materia</option>
                {materias.map(m => (
                  <option key={m.id} value={m.id}>{m.nombre}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Docente</label>
              <input
                value={formGrupo.docente}
                onChange={e => setFormGrupo({ ...formGrupo, docente: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha inicio</label>
              <input
                type="date"
                value={formGrupo.fecha_inicio}
                onChange={e => setFormGrupo({ ...formGrupo, fecha_inicio: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Fecha fin</label>
              <input
                type="date"
                value={formGrupo.fecha_fin}
                onChange={e => setFormGrupo({ ...formGrupo, fecha_fin: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <button type="submit" className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 transition">
              Crear grupo
            </button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Materia</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Horas</th>
              </tr>
            </thead>
            <tbody>
              {materias.length === 0 ? (
                <tr><td colSpan="2" className="px-4 py-4 text-gray-400 text-center">Sin materias</td></tr>
              ) : materias.map((m, i) => (
                <tr key={m.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">{m.nombre}</td>
                  <td className="px-4 py-3 text-gray-600">{m.horas || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Grupo</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Docente</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Cupo</th>
              </tr>
            </thead>
            <tbody>
              {grupos.length === 0 ? (
                <tr><td colSpan="3" className="px-4 py-4 text-gray-400 text-center">Sin grupos</td></tr>
              ) : grupos.map((g, i) => (
                <tr key={g.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {materias.find(m => m.id === g.materia_id)?.nombre || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{g.docente || '—'}</td>
                  <td className="px-4 py-3 text-gray-600">{g.cupo_ocupado}/{g.cupo_maximo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}