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
        {!user && (
          <>
            <Link to="/login" className="hover:underline">Iniciar sesión</Link>
            <Link to="/register" className="hover:underline">Registrarse</Link>
          </>
        )}

        {user && (
          <>
            <span className="text-sm">
              👋 Hola, <strong>{user.name}</strong> ({user.role})
            </span>

            {user.role === "admin" && (
              <Link
                to="/crear-usuario"
                className="bg-white text-blue-700 px-3 py-1 rounded hover:bg-gray-100"
              >
                Crear Usuario
              </Link>
            )}

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
