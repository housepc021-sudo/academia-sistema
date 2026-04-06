import API_URL from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

export default function AccesoLog() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [cargando, setCargando] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API_URL}/api/acceso/log`, { headers })
      .then(res => setLogs(res.data))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Log de accesos</h2>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {cargando ? (
          <p className="p-6 text-gray-400 text-sm">Cargando...</p>
        ) : logs.length === 0 ? (
          <p className="p-6 text-gray-400 text-sm">Sin registros de acceso.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Estudiante</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Cédula</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Resultado</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Motivo</th>
                <th className="text-left px-4 py-3 text-gray-600 font-medium">Fecha y hora</th>
              </tr>
            </thead>
            <tbody>
              {logs.map((log, i) => (
                <tr key={log.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 font-medium text-gray-800">
                    {log.estudiantes?.nombre || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.estudiantes?.cedula || '—'}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      log.resultado === 'permitido'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-600'
                    }`}>
                      {log.resultado}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {log.motivo || '—'}
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {new Date(log.created_at).toLocaleString()}
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