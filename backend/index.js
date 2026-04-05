const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const { verificarToken, soloAdmin } = require('./middleware/auth');

// Ruta publica
const authRoutes = require('./routes/auth');
app.use('/api/auth', authRoutes);

// Rutas protegidas
const estudiantesRoutes = require('./routes/estudiantes');
app.use('/api/estudiantes', verificarToken, estudiantesRoutes);

const pagosRoutes = require('./routes/pagos');
app.use('/api/pagos', verificarToken, pagosRoutes);

const materiasRoutes = require('./routes/materias');
app.use('/api/materias', verificarToken, materiasRoutes);

const gruposRoutes = require('./routes/grupos');
app.use('/api/grupos', verificarToken, gruposRoutes);

const inscripcionesRoutes = require('./routes/inscripciones');
app.use('/api/inscripciones', verificarToken, inscripcionesRoutes);

const asistenciaRoutes = require('./routes/asistencia');
app.use('/api/asistencia', verificarToken, asistenciaRoutes);

const accesoRoutes = require('./routes/acceso');
app.use('/api/acceso', accesoRoutes);

const estadisticasRoutes = require('./routes/estadisticas');
app.use('/api/estadisticas', verificarToken, estadisticasRoutes);

app.get('/', (req, res) => {
  res.send('API Academia funcionando');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});