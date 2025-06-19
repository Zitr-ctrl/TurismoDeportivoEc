import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const PublicarEvento = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    image: null,
  });

  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({ ...form, image: e.target.files[0] });
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!form.title || !form.description || !form.date || !form.location) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Crear FormData para enviar los archivos
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    if (form.image) formData.append("image", form.image);

    try {
      // Enviar el formulario con imagen
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/eventos`, // Endpoint para eventos
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setSuccessMessage("✅ Evento publicado con éxito");
      setForm({
        title: "",
        description: "",
        date: "",
        location: "",
        image: null,
      });
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error al publicar el evento");
    }
  };

  // Verificar si el usuario tiene permiso (admin o publicador)
  if (!user || (user.role !== "admin" && user.role !== "publicador")) {
    navigate("/"); // Redirige a la página principal si no tiene permisos
    return null;
  }

  return (
    <div className="p-8 max-w-2xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Publicar Evento Deportivo</h2>

      {error && (
        <div className="mb-4 text-sm p-2 rounded bg-red-100 text-red-800">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-4 text-sm p-2 rounded bg-green-100 text-green-800">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Título del Evento</label>
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Descripción</label>
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Fecha del Evento</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Ubicación</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Imagen (opcional)</label>
        <input
          type="file"
          name="image"
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border rounded"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Publicar Evento
        </button>
      </form>
    </div>
  );
};

export default PublicarEvento;
