import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Eventos = () => {
  const [eventos, setEventos] = useState([]);
  const [filteredEventos, setFilteredEventos] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [eventsPerPage] = useState(5); // Número de eventos por página
  const navigate = useNavigate();

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("es-ES"); // Formato español
  };

  // Obtener los eventos desde el backend
  useEffect(() => {
    const fetchEventos = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/eventos`);
        console.log("Eventos recibidos:", res.data); // Verifica los datos recibidos
        setEventos(res.data);
        setFilteredEventos(res.data); // Guardamos los eventos iniciales
      } catch (err) {
        console.log("Error al cargar los eventos:", err); // Detalles del error
        setError("❌ Error al cargar los eventos");
      }
    };
    fetchEventos();
  }, []);

  // Filtrar los eventos por búsqueda
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    const filteredData = eventos.filter(
      (evento) =>
        evento.title.toLowerCase().includes(searchValue) ||
        evento.description.toLowerCase().includes(searchValue)
    );
    setFilteredEventos(filteredData);
    setCurrentPage(1); // Resetear a la primera página cuando se haga una búsqueda
  };

  // Paginación: calcular los eventos actuales a mostrar
  const indexOfLastEvent = currentPage * eventsPerPage;
  const indexOfFirstEvent = indexOfLastEvent - eventsPerPage;
  const currentEvents = filteredEventos.slice(indexOfFirstEvent, indexOfLastEvent);

  // Cambiar de página
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4 text-center">Eventos Deportivos</h2>

      {error && (
        <div className="mb-4 text-sm p-2 rounded bg-red-100 text-red-800">
          {error}
        </div>
      )}

      {/* Barra de búsqueda */}
      <input
        type="text"
        placeholder="Buscar eventos..."
        className="p-2 border rounded mb-4"
        onChange={handleSearch}
      />

      {/* Tabla de eventos */}
      <table className="min-w-full table-auto">
        <thead>
          <tr>
            <th className="px-4 py-2">Título</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Ubicación</th>
            <th className="px-4 py-2">Fecha</th>
            <th className="px-4 py-2">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {currentEvents.length === 0 ? (
            <tr>
              <td colSpan="5" className="text-center p-4">
                No hay eventos disponibles.
              </td>
            </tr>
          ) : (
            currentEvents.map((evento) => (
              <tr key={evento._id}>
                <td className="border px-4 py-2">{evento.title}</td>
                <td className="border px-4 py-2">{evento.description}</td>
                <td className="border px-4 py-2">{evento.location}</td>
                <td className="border px-4 py-2">{formatDate(evento.date)}</td>
                <td className="border px-4 py-2">
                  <button
                    onClick={() => navigate(`/evento/${evento._id}`)}
                    className="bg-blue-600 text-white px-4 py-1 rounded hover:bg-blue-700"
                  >
                    Ver Detalles
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Paginación */}
      <div className="flex justify-center mt-4">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Anterior
        </button>
        <span className="px-4 py-2">{currentPage}</span>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === Math.ceil(filteredEventos.length / eventsPerPage)}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Siguiente
        </button>
      </div>
    </div>
  );
};

export default Eventos;
