export default function NavbarPublica() {
  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <a href="/" className="font-bold text-gray-800">Academia de Moda</a>
      <div className="flex gap-6">
        <a href="/cursos" className="text-sm text-gray-600 hover:text-gray-800">Cursos</a>
        <a href="/inscripcion" className="text-sm text-gray-600 hover:text-gray-800">Inscripción</a>
        <a href="/login" className="text-sm bg-gray-800 text-white px-4 py-1.5 rounded hover:bg-gray-700 transition">
          Portal
        </a>
      </div>
    </nav>
  );
}