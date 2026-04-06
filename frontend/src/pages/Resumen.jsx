import API_URL from '../config';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function Tarjeta({ titulo, valor, color }) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-500 mb-1">{titulo}</p>
      <p className={`text-3xl font-bold ${color || 'text-gray-800'}`}>{valor}</p>
    </div>
  );
}

export default function Resumen() {
  const { token } = useAuth();
  const [stats, setStats] = useState(null);
  const [cargando, setCargando] = useState(true);

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API_URL}/api/estadisticas`, { headers })
      .then(res => setStats(res.data))
      .finally(() => setCargando(false));
  }, []);

  if (cargando) {
    return <p className="text-gray-400 text-sm">Cargando estadísticas...</p>;
  }

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-700 mb-6">Resumen general</h2>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <Tarjeta
          titulo="Total estudiantes"
          valor={stats.totalEstudiantes}
          color="text-gray-800"
        />
        <Tarjeta
          titulo="Inscripciones activas"
          valor={stats.totalInscripciones}
          color="text-blue-600"
        />
        <Tarjeta
          titulo="Estudiantes al día"
          valor={stats.estudiantesAlDia}
          color="text-green-600"
        />
        <Tarjeta
          titulo="Estudiantes bloqueados"
          valor={stats.estudiantesBloqueados}
          color="text-red-500"
        />
        <Tarjeta
          titulo="Total recaudado"
          valor={`$${stats.totalRecaudado.toLocaleString()}`}
          color="text-gray-800"
        />
        <Tarjeta
          titulo="Accesos hoy"
          valor={stats.accesosHoy}
          color="text-gray-800"
        />
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="font-medium text-gray-700 mb-4">Estado de pagos</h3>
        <div className="flex items-center gap-4">
          <div className="flex-1 bg-gray-100 rounded-full h-4 overflow-hidden">
            <div
              className="bg-green-500 h-4 rounded-full transition-all"
              style={{
                width: stats.totalEstudiantes > 0
                  ? `${Math.round((stats.estudiantesAlDia / stats.totalEstudiantes) * 100)}%`
                  : '0%'
              }}
            />
          </div>
          <span className="text-sm text-gray-600 whitespace-nowrap">
            {stats.totalEstudiantes > 0
              ? `${Math.round((stats.estudiantesAlDia / stats.totalEstudiantes) * 100)}% al día`
              : '0% al día'
            }
          </span>
        </div>
      </div>
    </div>
  );
}