import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const DetallesEvento = () => {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user } = useContext(AuthContext); // Obtener el usuario actual desde el contexto

  useEffect(() => {
    const fetchEvento = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/eventos/${id}`);
        setEvento(res.data);
      } catch (err) {
        setError("❌ Error al cargar el evento");
      }
    };
    fetchEvento();
  }, [id]);

  const handleDelete = async () => {
    try {
      await axios.delete(`${import.meta.env.VITE_API_URL}/api/eventos/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      navigate("/eventos"); // Redirige a la lista de eventos después de eliminar
    } catch (err) {
      setError("❌ Error al eliminar el evento");
    }
  };

  const handleEdit = () => {
    navigate(`/editar-evento/${id}`); // Redirige a la página de edición
  };

  if (error) return <div>{error}</div>;
  if (!evento) return <div>Cargando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">{evento.title}</h2>
      <p className="mb-4">{evento.description}</p>
      <p className="text-sm text-gray-500">Ubicación: {evento.location}</p>
      <p className="text-sm text-gray-500">Fecha: {new Date(evento.date).toLocaleDateString()}</p>

      {/* Mostrar la imagen si existe */}
      {evento.image && (
        <img
          src={evento.image} // La URL completa de la imagen
          alt={evento.title}
          className="mt-4 rounded"
          style={{ width: "100%", height: "auto" }}
        />
      )}

      <div className="mt-4 flex justify-between">
        {/* Mostrar el botón de editar solo si el usuario tiene el rol adecuado */}
        {["admin", "publicador"].includes(user?.role) && (
          <button
            onClick={handleEdit}
            className="bg-yellow-600 text-white px-4 py-2 rounded hover:bg-yellow-700"
          >
            Editar Evento
          </button>
        )}

        {/* Mostrar el botón de eliminar solo si el usuario tiene el rol adecuado */}
        {["admin", "publicador"].includes(user?.role) && (
          <button
            onClick={handleDelete}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Eliminar Evento
          </button>
        )}
      </div>
    </div>
  );
};

export default DetallesEvento;
