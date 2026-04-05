import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Inicio from './pages/publico/Inicio';
import Cursos from './pages/publico/Cursos';
import Inscripcion from './pages/publico/Inscripcion';
import NavbarPublica from './components/NavbarPublica';

function RutaProtegida({ children }) {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
}

function LayoutPublico({ children }) {
  return (
    <div>
      <NavbarPublica />
      {children}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LayoutPublico><Inicio /></LayoutPublico>} />
          <Route path="/cursos" element={<LayoutPublico><Cursos /></LayoutPublico>} />
          <Route path="/inscripcion" element={<LayoutPublico><Inscripcion /></LayoutPublico>} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={
            <RutaProtegida>
              <Dashboard />
            </RutaProtegida>
          } />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;