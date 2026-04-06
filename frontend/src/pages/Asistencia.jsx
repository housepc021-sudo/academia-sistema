import API_URL from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Asistencia() {
  const { token } = useAuth();
  const [grupos, setGrupos] = useState([]);
  const [materias, setMaterias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [grupoSeleccionado, setGrupoSeleccionado] = useState('');
  const [asistencia, setAsistencia] = useState([]);
  const [form, setForm] = useState({ estudiante_id: '', tipo: 'entrada' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/grupos`, { headers }),
      axios.get(`${API_URL}/api/materias`, { headers }),
      axios.get(`${API_URL}/api/estudiantes`, { headers }),
    ]).then(([g, m, e]) => {
      setGrupos(g.data);
      setMaterias(m.data);
      setEstudiantes(e.data);
    });
  }, []);

  const cargarAsistencia = async (id) => {
    const res = await axios.get(`${API_URL}/api/asistencia/grupo/${id}`, { headers });
    setAsistencia(res.data);
  };

  const handleGrupo = (e) => {
    setGrupoSeleccionado(e.target.value);
    if (e.target.value) cargarAsistencia(e.target.value);
    else setAsistencia([]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/api/asistencia`, {
        estudiante_id: parseInt(form.estudiante_id),
        grupo_id: parseInt(grupoSeleccionado),
        tipo: form.tipo,
        metodo: 'manual'
      }, { headers });
      setExito('Asistencia registrada');
      setForm({ estudiante_id: '', tipo: 'entrada' });
      cargarAsistencia(grupoSeleccionado);
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al registrar');
    }
  };

  const getNombreMateria = (grupo) => {
    const materia = materias.find(m => m.id === grupo.materia_id);
    return materia?.nombre || '—';
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Asistencia</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {exito && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{exito}</div>}

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">Grupo</label>
            <select
              value={grupoSeleccionado}
              onChange={handleGrupo}
              className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
            >
              <option value="">Seleccionar grupo</option>
              {grupos.map(g => (
                <option key={g.id} value={g.id}>
                  {getNombreMateria(g)} — {g.docente || 'Sin docente'}
                </option>
              ))}
            </select>
          </div>
        </div>

        {grupoSeleccionado && (
          <form onSubmit={handleSubmit} className="grid grid-cols-3 gap-4 border-t pt-4">
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
              <label className="block text-sm text-gray-600 mb-1">Tipo</label>
              <select
                value={form.tipo}
                onChange={e => setForm({ ...form, tipo: e.target.value })}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="entrada">Entrada</option>
                <option value="salida">Salida</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                type="submit"
                className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 transition"
              >
                Registrar
              </button>
            </div>
          </form>
        )}
      </div>

      {grupoSeleccionado && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estudiante</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Tipo</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Método</th>
              </tr>
            </thead>
            <tbody>
              {asistencia.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-4 py-6 text-center text-gray-400">
                    Sin registros de asistencia
                  </td>
                </tr>
              ) : asistencia.map((a, i) => (
                <tr key={a.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {a.estudiantes?.nombre || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">{a.fecha}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      a.tipo === 'entrada'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-blue-100 text-blue-700'
                    }`}>
                      {a.tipo}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600 capitalize">{a.metodo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}