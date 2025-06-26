import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrearUsuario from "./pages/CrearUsuario"; // ✅ nueva ruta para crear usuario
import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";
import PublicarEvento from "./pages/PublicarEvento"; // ✅ nueva ruta para publicar eventos
import Eventos from "./pages/Eventos"; // ✅ ruta para ver eventos deportivos
import DetallesEvento from "./pages/DetallesEvento"; // ✅ nueva ruta para ver los detalles de un evento
import EditarEvento from "./pages/EditarEvento"; // ✅ nueva ruta para editar eventos

const App = () => {
  return (
    <>
      <Navbar />
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rutas protegidas */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Home />
            </PrivateRoute>
          }
        />
        <Route
          path="/crear-usuario"
          element={
            <PrivateRoute>
              <CrearUsuario /> {/* Solo mostrar CrearUsuario */}
            </PrivateRoute>
          }
        />
        <Route
          path="/publicar-evento"
          element={
            <PrivateRoute>
              <PublicarEvento /> {/* Solo mostrar PublicarEvento */}
            </PrivateRoute>
          }
        />
        <Route
          path="/eventos"
          element={
            <PrivateRoute>
              <Eventos /> {/* Ruta para mostrar todos los eventos */}
            </PrivateRoute>
          }
        />
        {/* Ruta para ver los detalles del evento */}
        <Route
          path="/evento/:id"
          element={
            <PrivateRoute>
              <DetallesEvento /> {/* Ver detalles del evento */}
            </PrivateRoute>
          }
        />
        {/* Ruta para editar un evento */}
        <Route
          path="/editar-evento/:id"
          element={
            <PrivateRoute>
              <EditarEvento /> {/* Página de edición de evento */}
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
