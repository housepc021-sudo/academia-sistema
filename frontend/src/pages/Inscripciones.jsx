import API_URL from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Inscripciones() {
  const { token } = useAuth();
  const [inscripciones, setInscripciones] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [form, setForm] = useState({ estudiante_id: '', grupo_id: '', modalidad: 'curso_corto' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const cargarDatos = async () => {
    const [i, e, g, m] = await Promise.all([
      axios.get(`${API_URL}/api/inscripciones`, { headers }),
      axios.get(`${API_URL}/api/estudiantes`, { headers }),
      axios.get(`${API_URL}/api/grupos`, { headers }),
      axios.get(`${API_URL}/api/materias`, { headers }),
    ]);
    setInscripciones(i.data);
    setEstudiantes(e.data);
    setGrupos(g.data);
    setMaterias(m.data);
  };

  useEffect(() => { cargarDatos(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/api/inscripciones`, {
        estudiante_id: parseInt(form.estudiante_id),
        grupo_id: parseInt(form.grupo_id),
        modalidad: form.modalidad
      }, { headers });
      setExito('Inscripcion realizada correctamente');
      setForm({ estudiante_id: '', grupo_id: '', modalidad: 'curso_corto' });
      cargarDatos();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al inscribir');
    }
  };

  const cancelar = async (id) => {
    if (!confirm('¿Cancelar esta inscripcion?')) return;
    try {
      await axios.patch(`${API_URL}/api/inscripciones/${id}/cancelar`, {}, { headers });
      cargarDatos();
    } catch {
      setError('Error al cancelar');
    }
  };

  const getNombreMateria = (grupo) => {
    if (grupo?.materias?.nombre) return grupo.materias.nombre;
    const materia = materias.find(m => m.id === grupo?.materia_id);
    return materia?.nombre || '—';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Inscripciones</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {exito && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{exito}</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h3 className="font-medium text-gray-700 mb-4">Nueva inscripcion</h3>
        <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Estudiante</label>
            <select
              value={form.estudiante_id}
              onChange={e => setForm({ ...form, estudiante_id: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Seleccionar</option>
              {estudiantes.map(e => (
                <option key={e.id} value={e.id}>{e.nombre}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Grupo</label>
            <select
              value={form.grupo_id}
              onChange={e => setForm({ ...form, grupo_id: e.target.value })}
              required
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Seleccionar</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>
                  {getNombreMateria(g)} — {g.cupo_ocupado}/{g.cupo_maximo} cupos
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-600 mb-1">Modalidad</label>
            <select
              value={form.modalidad}
              onChange={e => setForm({ ...form, modalidad: e.target.value })}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="curso_corto">Curso corto</option>
              <option value="carrera_larga">Carrera larga</option>
            </select>
          </div>
          <div className="col-span-3">
            <button
              type="submit"
              className="bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-700 transition"
            >
              Inscribir estudiante
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Estudiante</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Materia</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Modalidad</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Estado</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
              <th className="text-left px-4 py-3 text-gray-600 font-medium">Acción</th>
            </tr>
          </thead>
          <tbody>
            {inscripciones.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-4 py-6 text-center text-gray-400">
                  Sin inscripciones registradas
                </td>
              </tr>
            ) : inscripciones.map((ins, i) => (
              <tr key={ins.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                <td className="px-4 py-3 font-medium text-gray-800">
                  {ins.estudiantes?.nombre || '—'}
                </td>
                <td className="px-4 py-3 text-gray-600">
                  {ins.grupos?.materias?.nombre || '—'}
                </td>
                <td className="px-4 py-3 text-gray-600 capitalize">
                  {ins.modalidad?.replace('_', ' ')}
                </td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    ins.estado === 'activa'
                      ? 'bg-green-100 text-green-700'
                      : 'bg-red-100 text-red-600'
                  }`}>
                    {ins.estado}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-600">{ins.fecha_inscripcion}</td>
                <td className="px-4 py-3">
                  {ins.estado === 'activa' && (
                    <button
                      onClick={() => cancelar(ins.id)}
                      className="text-red-500 hover:text-red-700 text-xs"
                    >
                      Cancelar
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}