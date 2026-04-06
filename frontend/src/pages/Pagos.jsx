import API_URL from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function Pagos() {
  const { token } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [pagos, setPagos] = useState([]);
  const [estudianteSeleccionado, setEstudianteSeleccionado] = useState('');
  const [form, setForm] = useState({ monto: '', metodo: 'efectivo', descripcion: '' });
  const [error, setError] = useState('');
  const [exito, setExito] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API_URL}/api/estudiantes`, { headers })
      .then(res => setEstudiantes(res.data))
      .catch(() => setError('Error al cargar estudiantes'));
  }, []);

  const cargarPagos = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/pagos/estudiante/${id}`, { headers });
      setPagos(res.data);
    } catch {
      setPagos([]);
    }
  };

  const handleEstudiante = (e) => {
    setEstudianteSeleccionado(e.target.value);
    if (e.target.value) cargarPagos(e.target.value);
    else setPagos([]);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!estudianteSeleccionado) {
      setError('Selecciona un estudiante');
      return;
    }
    try {
      await axios.post(`${API_URL}/api/pagos`, {
        estudiante_id: parseInt(estudianteSeleccionado),
        monto: parseFloat(form.monto),
        metodo: form.metodo,
        descripcion: form.descripcion
      }, { headers });
      setExito('Pago registrado correctamente');
      setForm({ monto: '', metodo: 'efectivo', descripcion: '' });
      cargarPagos(estudianteSeleccionado);
      setTimeout(() => setExito(''), 3000);
    } catch {
      setError('Error al registrar pago');
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Pagos</h2>

      {error && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>}
      {exito && <div className="bg-green-50 text-green-600 p-3 rounded mb-4 text-sm">{exito}</div>}

      <div className="grid grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-700 mb-4">Registrar pago</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Estudiante</label>
              <select
                value={estudianteSeleccionado}
                onChange={handleEstudiante}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="">Seleccionar estudiante</option>
                {estudiantes.map(e => (
                  <option key={e.id} value={e.id}>{e.nombre} — {e.cedula}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Monto</label>
              <input
                name="monto"
                type="number"
                value={form.monto}
                onChange={handleChange}
                required
                placeholder="0.00"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Método</label>
              <select
                name="metodo"
                value={form.metodo}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                <option value="efectivo">Efectivo</option>
                <option value="transferencia">Transferencia</option>
                <option value="tarjeta">Tarjeta</option>
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-600 mb-1">Descripción</label>
              <input
                name="descripcion"
                value={form.descripcion}
                onChange={handleChange}
                placeholder="Mensualidad abril"
                className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 transition"
            >
              Registrar pago
            </button>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="font-medium text-gray-700 mb-4">Historial de pagos</h3>
          {!estudianteSeleccionado ? (
            <p className="text-gray-400 text-sm">Selecciona un estudiante para ver su historial.</p>
          ) : pagos.length === 0 ? (
            <p className="text-gray-400 text-sm">Sin pagos registrados.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b">
                <tr>
                  <th className="text-left py-2 text-gray-600 font-medium">Fecha</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Monto</th>
                  <th className="text-left py-2 text-gray-600 font-medium">Método</th>
                </tr>
              </thead>
              <tbody>
                {pagos.map(p => (
                  <tr key={p.id} className="border-b last:border-0">
                    <td className="py-2 text-gray-600">{p.fecha_pago}</td>
                    <td className="py-2 font-medium text-gray-800">${p.monto}</td>
                    <td className="py-2 text-gray-600 capitalize">{p.metodo}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}