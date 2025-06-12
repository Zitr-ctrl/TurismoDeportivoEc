import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/login`, form);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error de inicio de sesión");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/auth/google`, {
        token: credentialResponse.credential,
      });
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert("Error al iniciar sesión con Google");
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
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
          Ingresar
        </button>

        <div className="mt-6 text-center">
          <p className="mb-2 text-sm text-gray-600">o inicia con Google</p>
          <GoogleLogin onSuccess={handleGoogleLogin} onError={() => alert("Error con Google")} />
        </div>
      </form>
    </div>
  );
};

export default Login;
