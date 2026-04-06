import API_URL from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Estudiantes() {
  const { token } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState({
    nombre: '', cedula: '', telefono: '', email: ''
  });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const cargarEstudiantes = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/estudiantes`, { headers });
      setEstudiantes(res.data);
    } catch (err) {
      setError('Error al cargar estudiantes');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarEstudiantes();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/api/estudiantes`, form, { headers });
      setExito('Estudiante registrado correctamente');
      setForm({ nombre: '', cedula: '', telefono: '', email: '' });
      setMostrarForm(false);
      cargarEstudiantes();
      setTimeout(() => setExito(''), 3000);
    } catch (err) {
      setError('Error al registrar estudiante');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-700">Estudiantes</h2>
        <button
          onClick={() => setMostrarForm(!mostrarForm)}
          className="bg-gray-800 text-white px-4 py-2 rounded text-sm hover:bg-gray-700 transition"
        >
          {mostrarForm ? 'Cancelar' : '+ Nuevo estudiante'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}
      {exito && (
        <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{exito}</div>
      )}

      {mostrarForm && (
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h3 className="font-medium text-gray-700 mb-4">Nuevo estudiante</h3>
          <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Nombre completo</label>
              <input
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Cédula</label>
              <input
                name="cedula"
                value={form.cedula}
                onChange={handleChange}
                required
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Teléfono</label>
              <input
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div className="col-span-2">
              <button
                type="submit"
                className="bg-gray-800 text-white px-6 py-2 rounded text-sm hover:bg-gray-700 transition"
              >
                Registrar estudiante
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cargando ? (
          <p className="p-6 text-gray-500 text-sm">Cargando...</p>
        ) : estudiantes.length === 0 ? (
          <p className="p-6 text-gray-500 text-sm">No hay estudiantes registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Nombre</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Cédula</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Teléfono</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-gray-600 font-medium">Estado</th>
              </tr>
            </thead>
            <tbody>
              {estudiantes.map((e, i) => (
                <tr key={e.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-6 py-3 font-medium text-gray-800">{e.nombre}</td>
                  <td className="px-6 py-3 text-gray-600">{e.cedula}</td>
                  <td className="px-6 py-3 text-gray-600">{e.telefono || '—'}</td>
                  <td className="px-6 py-3 text-gray-600">{e.email || '—'}</td>
                  <td className="px-6 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      e.estado_cuenta === 'al_dia'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {e.estado_cuenta === 'al_dia' ? 'Al día' : 'Bloqueado'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}