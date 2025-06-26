import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const EditarEvento = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evento, setEvento] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

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

  const handleChange = (e) => {
    setEvento({ ...evento, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(`${import.meta.env.VITE_API_URL}/api/eventos/${id}`, evento, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setMessage("Evento actualizado con éxito");
      setTimeout(() => {
        navigate(`/evento/${id}`);
      }, 2000);
    } catch (err) {
      setError("❌ Error al actualizar el evento");
    }
  };

  if (error) return <div>{error}</div>;
  if (!evento) return <div>Cargando...</div>;

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Evento</h2>

      {message && (
        <div className="mb-4 text-sm p-2 rounded bg-green-100 text-green-800">
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Título</label>
        <input
          name="title"
          value={evento.title}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Descripción</label>
        <textarea
          name="description"
          value={evento.description}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Ubicación</label>
        <input
          name="location"
          value={evento.location}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Fecha</label>
        <input
          type="date"
          name="date"
          value={evento.date.split("T")[0]}
          onChange={handleChange}
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Guardar Cambios
        </button>
      </form>
    </div>
  );
};

export default EditarEvento;
