import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-blue-700 p-4 text-white flex justify-between items-center">
      <Link to="/" className="text-xl font-bold">
        Turismo Deportivo
      </Link>

      <div className="flex items-center space-x-4">
        {/* Mostrar enlaces de login y registro si no hay usuario */}
        {!user && (
          <>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
            <Link to="/register" className="hover:underline">Registrarse</Link>
          </>
        )}

        {/* Si el usuario está logueado */}
        {user && (
          <>
            <span className="text-sm">
              👋 Hola, <strong>{user.name}</strong> ({user.role})
            </span>

            {/* Enlace para 'Crear Usuario' solo visible para admin */}
            {user.role === "admin" && (
              <Link
                to="/crear-usuario"
                className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100"
              >
                Crear Usuario
              </Link>
            )}

            {/* Enlace para 'Publicar Evento' visible para admin y publicador */}
            {["admin", "publicador"].includes(user.role) && (
              <Link
                to="/publicar-evento"
                className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100"
              >
                Publicar Evento
              </Link>
            )}

            {/* Enlace para ver todos los eventos */}
            <Link
              to="/eventos"
              className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100"
            >
              Ver Eventos
            </Link>

            {/* Botón de cerrar sesión */}
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
            >
              Cerrar sesión
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
