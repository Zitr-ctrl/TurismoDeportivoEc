import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { GoogleMap, LoadScript, Marker, Autocomplete } from "@react-google-maps/api"; // Usamos Autocomplete para buscar direcciones

const PublicarEvento = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    location: "",
    lat: null, // Latitud
    lng: null, // Longitud
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
    if (!form.title || !form.description || !form.date || !form.location || !form.lat || !form.lng) {
      setError("Todos los campos son obligatorios");
      return;
    }

    // Crear FormData para enviar los archivos
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("date", form.date);
    formData.append("location", form.location);
    formData.append("lat", form.lat); // Agregar latitud
    formData.append("lng", form.lng); // Agregar longitud
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
        lat: null,
        lng: null,
        image: null,
      });
      navigate("/eventos"); // Redirigir a la lista de eventos después de publicar
    } catch (err) {
      setError(err.response?.data?.message || "❌ Error al publicar el evento");
    }
  };

  // Verificar si el usuario tiene permiso (admin o publicador)
  if (!user || (user.role !== "admin" && user.role !== "publicador")) {
    navigate("/"); // Redirige a la página principal si no tiene permisos
    return null;
  }

  // Función para manejar el clic en el mapa y seleccionar ubicación
  const handleMapClick = (e) => {
    const lat = e.latLng.lat();
    const lng = e.latLng.lng();
    setForm({ ...form, lat, lng }); // Guardar las coordenadas de latitud y longitud
  };

  // Función para actualizar la ubicación cuando se selecciona desde el Autocomplete
  const handlePlaceSelect = (place) => {
    if (place.geometry) {
      const lat = place.geometry.location.lat();
      const lng = place.geometry.location.lng();
      setForm({
        ...form,
        location: place.formatted_address,
        lat,
        lng,
      });
    }
  };

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
        ></textarea>

        <label className="block mb-1">Fecha del Evento</label>
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Ciudad (Ubicación)</label>
        <input
          type="text"
          name="location"
          value={form.location}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        {/* Mapa interactivo y búsqueda de ubicación */}
        <div className="mb-4">
          <LoadScript googleMapsApiKey="AIzaSyDsrWTJEfxG_Njk_GQjSaKPUGSRTwr6sK8" libraries={["places"]}>
            <GoogleMap
              mapContainerStyle={{
                height: "400px",
                width: "100%",
              }}
              center={{ lat: form.lat || -1.8312, lng: form.lng || -78.1835 }} // Mapa centrado en Ecuador por defecto
              zoom={12}
              onClick={handleMapClick} // Llamada a la función para obtener las coordenadas
            >
              {form.lat && form.lng && (
                <Marker position={{ lat: form.lat, lng: form.lng }} />
              )}
            </GoogleMap>

            {/* Autocomplete para buscar la ubicación */}
            <Autocomplete
              onPlaceChanged={() => handlePlaceSelect(document.getElementById("autocomplete").value)}
            >
              <input
                type="text"
                id="autocomplete"
                className="p-2 mb-4 w-full border rounded"
                placeholder="Buscar ubicación..."
              />
            </Autocomplete>
          </LoadScript>
        </div>

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
