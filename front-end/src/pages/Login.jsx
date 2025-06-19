import { useState, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/login`, form);
      login(res.data.token);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Error de inicio de sesión");
    }
  };

  const handleGoogleLogin = async (credentialResponse) => {
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/auth/google`, {
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

        <label htmlFor="email">Correo:</label>
        <input
          type="email"
          name="email"
          placeholder="Correo"
          onChange={handleChange}
          required
          className="w-full mb-4 px-4 py-2 border rounded"
        />

        <label htmlFor="password">Contraseña:</label>
        <div className="relative mb-6">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Ingresar
        </button>

        <div className="mt-6 text-center">
          <p className="mb-2 text-sm text-gray-600">o inicia con Google</p>
          <GoogleLogin
            onSuccess={handleGoogleLogin}
            onError={() => alert("Error con Google")}
          />
        </div>
      </form>
    </div>
  );
};

export default Login;
