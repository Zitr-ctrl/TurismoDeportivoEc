import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Home = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-4">
        Bienvenido a Turismo Deportivo
      </h1>
      {user ? (
        <div>
          <p className="text-lg text-gray-700">Hola, <strong>{user.name}</strong> 👋</p>
          <button
            onClick={logout}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Cerrar sesión
          </button>
        </div>
      ) : (
        <p className="text-gray-500">Inicia sesión para ver más.</p>
      )}
    </div>
  );
};

export default Home;
