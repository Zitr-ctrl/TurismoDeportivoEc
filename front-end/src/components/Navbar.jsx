import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="bg-blue-700 p-4 text-white flex justify-between">
      <Link to="/" className="font-bold text-xl">Turismo Deportivo</Link>
      <div className="space-x-4">
        {user ? (
          <span>Hola, {user.name}</span>
        ) : (
          <>
            <Link to="/login" className="hover:underline">Login</Link>
            <Link to="/register" className="hover:underline">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
