import { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const DetallesEvento = () => {
  const { id } = useParams(); // Obtener el ID del evento desde la URL
  const [evento, setEvento] = useState(null);
  const [error, setError] = useState("");

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
    </div>
  );
};

export default DetallesEvento;
