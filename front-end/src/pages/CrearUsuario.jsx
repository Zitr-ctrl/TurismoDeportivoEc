import { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const CrearUsuario = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "publicador",
  });
  const [mensaje, setMensaje] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // 🔒 Esperar a que el contexto del usuario esté disponible
  useEffect(() => {
    if (user && user.role !== "admin") {
      navigate("/"); // redirige solo si ya hay user y no es admin
    }
  }, [user]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("❌ Las contraseñas no coinciden");
      return;
    }

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        {
          name: form.name,
          email: form.email,
          password: form.password,
          role: form.role,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setMensaje("✅ Usuario creado correctamente");
      setError("");
      setForm({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "publicador",
      });
    } catch (err) {
      setMensaje("");
      setError(err.response?.data?.message || "❌ Error al crear el usuario");
    }
  };

  if (!user) return null; // 🙏 evitar mostrar el componente mientras user no se carga

  return (
    <div className="p-8 max-w-xl mx-auto bg-white shadow-md rounded">
      <h2 className="text-2xl font-bold mb-4 text-center">Crear nuevo usuario</h2>

      {error && (
        <div className="mb-4 text-sm p-2 rounded bg-red-100 text-red-800">
          {error}
        </div>
      )}
      {mensaje && (
        <div className="mb-4 text-sm p-2 rounded bg-green-100 text-green-800">
          {mensaje}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <label className="block mb-1">Nombre</label>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Correo</label>
        <input
          name="email"
          type="email"
          value={form.email}
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label className="block mb-1">Contraseña</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded pr-10"
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-500"
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        <label className="block mb-1">Confirmar contraseña</label>
        <div className="relative mb-4">
          <input
            type={showConfirm ? "text" : "password"}
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border rounded pr-10"
          />
          <span
            onClick={() => setShowConfirm(!showConfirm)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer text-sm text-gray-500"
          >
            {showConfirm ? "🙈" : "👁️"}
          </span>
        </div>

        <label className="block mb-1">Rol</label>
        <select
          name="role"
          value={form.role}
          onChange={handleChange}
          className="w-full mb-6 px-4 py-2 border rounded"
        >
          <option value="publicador">Publicador</option>
          <option value="admin">Administrador</option>
        </select>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Crear Usuario
        </button>
      </form>
    </div>
  );
};

export default CrearUsuario;
