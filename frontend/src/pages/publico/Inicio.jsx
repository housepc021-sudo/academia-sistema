export default function Inicio() {
  return (
    <div>
      <section className="bg-gray-900 text-white py-20 px-6 text-center">
        <h1 className="text-4xl font-bold mb-4">Academia de Moda</h1>
        <p className="text-gray-300 text-lg mb-8 max-w-xl mx-auto">
          Formamos profesionales en diseño, patronaje y moda. 
          Cursos cortos y carrera completa disponibles.
        </p>
        <a
          href="/inscripcion"
          className="bg-white text-gray-900 px-6 py-3 rounded font-medium hover:bg-gray-100 transition"
        >
          Inscríbete ahora
        </a>
      </section>

      <section className="py-16 px-6 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          ¿Qué ofrecemos?
        </h2>
        <div className="grid grid-cols-3 gap-6">
          {[
            { titulo: 'Carrera larga', desc: 'Programa completo con certificación anual. Todas las materias en secuencia.' },
            { titulo: 'Cursos cortos', desc: 'Toma solo las materias que necesitas. Equivalen a la carrera si decides continuarla.' },
            { titulo: 'Certificación', desc: 'Recibe tu certificado al completar cada año del programa.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6">
              <h3 className="font-semibold text-gray-800 mb-2">{item.titulo}</h3>
              <p className="text-gray-500 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-gray-50 py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Contacto</h2>
          <p className="text-gray-500">Visítanos o escríbenos para más información.</p>
        </div>
      </section>
    </div>
  );
}