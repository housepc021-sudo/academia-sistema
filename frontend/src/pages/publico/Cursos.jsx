import API_URL from '../../config';
import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Cursos() {
  const [materias, setMaterias] = useState([]);
  const [grupos, setGrupos] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    Promise.all([
      axios.get(`${API_URL}/api/publico/materias`),
      axios.get(`${API_URL}/api/publico/grupos`),
    ]).then(([m, g]) => {
      setMaterias(m.data);
      setGrupos(g.data);
    }).finally(() => setCargando(false));
  }, []);

  const getGruposDeMateria = (materiaId) => {
    return grupos.filter(g => g.materia_id === materiaId);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Cursos disponibles</h1>
      <p className="text-gray-500 mb-8">Calendario planificado para este año académico.</p>

      {cargando ? (
        <p className="text-gray-400">Cargando...</p>
      ) : materias.length === 0 ? (
        <p className="text-gray-400">No hay cursos disponibles por el momento.</p>
      ) : (
        <div className="space-y-6">
          {materias.map(materia => (
            <div key={materia.id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h2 className="font-semibold text-gray-800 text-lg">{materia.nombre}</h2>
                  <p className="text-gray-500 text-sm">{materia.descripcion}</p>
                </div>
                {materia.horas && (
                  <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">
                    {materia.horas}h
                  </span>
                )}
              </div>

              {getGruposDeMateria(materia.id).length > 0 ? (
                <div className="border-t pt-3 mt-3">
                  <p className="text-xs text-gray-500 mb-2 font-medium">Grupos disponibles</p>
                  <div className="grid grid-cols-2 gap-3">
                    {getGruposDeMateria(materia.id).map(grupo => (
                      <div key={grupo.id} className="bg-gray-50 rounded p-3 text-sm">
                        <p className="text-gray-700">
                          {grupo.fecha_inicio} → {grupo.fecha_fin}
                        </p>
                        <p className="text-gray-500">Docente: {grupo.docente || '—'}</p>
                        <p className={`font-medium mt-1 ${
                          grupo.cupo_ocupado >= grupo.cupo_maximo
                            ? 'text-red-500'
                            : 'text-green-600'
                        }`}>
                          {grupo.cupo_ocupado >= grupo.cupo_maximo
                            ? 'Sin cupos'
                            : `${grupo.cupo_maximo - grupo.cupo_ocupado} cupos disponibles`
                          }
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-400 text-sm border-t pt-3 mt-3">
                  Sin grupos programados
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}