import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Login = ({ setToken }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await api.post("/auth/login", form);

      const token = res.data.data.token;

      localStorage.setItem("token", token);
      setToken(token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-blue-600 to-indigo-600">

      <h1 className="text-4xl font-bold text-white mb-6">
        ☁️ CloudDrop
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-5">

        <h2 className="text-2xl font-bold text-center text-blue-600">
          Welcome Back
        </h2>

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400"
        />

        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
        >
          Login
        </button>

        <p className="text-sm text-center">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-blue-500 font-semibold">
            Signup
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;