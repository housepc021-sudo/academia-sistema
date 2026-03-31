import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import Estudiantes from './Estudiantes';

export default function Dashboard() {
  const { usuario, logout } = useAuth();
  const [seccion, setSeccion] = useState('estudiantes');

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
            <li>
              <button
                onClick={() => setSeccion('estudiantes')}
                className={`w-full text-left px-3 py-2 rounded text-sm transition ${
                  seccion === 'estudiantes'
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                Estudiantes
              </button>
            </li>
          </ul>
        </aside>

        <main className="flex-1 p-6">
          {seccion === 'estudiantes' && <Estudiantes />}
        </main>
      </div>
    </div>
  );
}