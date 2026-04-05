import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Estudiantes from './Estudiantes';
import Pagos from './Pagos';
import Materias from './Materias';
import Inscripciones from './Inscripciones';
import Asistencia from './Asistencia';
import AccesoLog from './AccesoLog';
import Resumen from './Resumen';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const [seccion, setSeccion] = useState('resumen');

  const items = [
    { key: 'resumen',        label: 'Resumen' },
    { key: 'estudiantes',    label: 'Estudiantes' },
    { key: 'pagos',          label: 'Pagos' },
    { key: 'materias',       label: 'Materias y Grupos' },
    { key: 'inscripciones',  label: 'Inscripciones' },
    { key: 'asistencia',     label: 'Asistencia' },
    { key: 'acceso',         label: 'Log de accesos' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
        <h1 className="font-bold text-gray-800">Academia de Moda</h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">
            {usuario?.nombre} — {usuario?.rol}
          </span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      </nav>

      <div className="flex">
        <aside className="w-48 min-h-screen bg-white shadow-sm p-4">
          <ul className="space-y-1">
            {items.map(item => (
              <li key={item.key}>
                <button
                  onClick={() => setSeccion(item.key)}
                  className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                    seccion === item.key
                      ? 'bg-gray-800 text-white'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </aside>

        <main className="flex-1 p-6">
          {seccion === 'resumen'       && <Resumen />}
          {seccion === 'estudiantes'   && <Estudiantes />}
          {seccion === 'pagos'         && <Pagos />}
          {seccion === 'materias'      && <Materias />}
          {seccion === 'inscripciones' && <Inscripciones />}
          {seccion === 'asistencia'    && <Asistencia />}
          {seccion === 'acceso'        && <AccesoLog />}
        </main>
      </div>
    </div>
  );
}