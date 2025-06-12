import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, form);
      localStorage.setItem("token", res.data.token);
      navigate("/");
    } catch (error) {
      alert(error.response?.data?.message || "Error al registrarse");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Crear cuenta</h2>
        <input
          type="text"
          name="name"
          placeholder="Nombre"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          onChange={handleChange}
          required
          className="w-full mb-6 px-4 py-2 border rounded"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Registrarse
        </button>
      </form>
    </div>
  );
};

export default Register;
