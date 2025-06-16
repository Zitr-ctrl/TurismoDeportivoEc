import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CrearUsuario from "./pages/CrearUsuario"; // ✅ nuevo
import Navbar from "./components/Navbar";
import PrivateRoute from "./routes/PrivateRoute";

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
              <CrearUsuario />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
};

export default App;
