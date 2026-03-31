import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { usuario, logout } = useAuth();

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
      <main className="p-6">
        <h2 className="text-xl font-semibold text-gray-700">
          Bienvenido, {usuario?.nombre}
        </h2>
        <p className="text-gray-500 mt-1">Panel de administración</p>
      </main>
    </div>
  );
}