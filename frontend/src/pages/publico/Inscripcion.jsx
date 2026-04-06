import API_URL from '../../config';
import { useState } from 'react';
import axios from 'axios';

export default function Inscripcion() {
  const [form, setForm] = useState({
    nombre: '', cedula: '', telefono: '', email: ''
  });
  const [enviado, setEnviado] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await axios.post(`${API_URL}/api/publico/solicitud-inscripcion`, form);
      setEnviado(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Error al enviar solicitud');
    }
  };

  if (enviado) {
    return (
      <div className="max-w-lg mx-auto py-20 px-6 text-center">
        <div className="bg-green-50 rounded-lg p-8">
          <h2 className="text-2xl font-bold text-green-700 mb-2">Solicitud enviada</h2>
          <p className="text-green-600">
            Recibimos tu solicitud. El equipo de la academia se pondrá en contacto contigo pronto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Inscripción</h1>
      <p className="text-gray-500 mb-8">
        Completa el formulario y nos comunicaremos contigo para confirmar tu inscripción.
      </p>

      {error && (
        <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{error}</div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow p-6 space-y-4">
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
            type="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-gray-800 text-white py-2 rounded text-sm hover:bg-gray-700 transition"
        >
          Enviar solicitud
        </button>
      </form>
    </div>
  );
}