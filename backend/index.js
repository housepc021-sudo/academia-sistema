const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Rutas
const estudiantesRoutes = require('./routes/estudiantes');
app.use('/api/estudiantes', estudiantesRoutes);

const pagosRoutes = require('./routes/pagos');
app.use('/api/pagos', pagosRoutes);

const materiasRoutes = require('./routes/materias');
app.use('/api/materias', materiasRoutes);

const gruposRoutes = require('./routes/grupos');
app.use('/api/grupos', gruposRoutes);

// Ruta base
app.get('/', (req, res) => {
  res.send('API Academia funcionando');
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});