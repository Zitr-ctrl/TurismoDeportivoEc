import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  // Esperar a que se cargue user (importante para evitar renderizar antes de tiempo)
  if (user === null) return null;

  return user ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
