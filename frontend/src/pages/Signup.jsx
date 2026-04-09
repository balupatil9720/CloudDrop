import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/api";

const Signup = ({ setToken }) => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSignup = async () => {
    try {
      const res = await api.post("/auth/register", form);

      const token = res.data.data.token;

      localStorage.setItem("token", token);
      setToken(token);

      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-linear-to-r from-green-500 to-emerald-600">

      <h1 className="text-4xl font-bold text-white mb-6">
        ☁️ CloudDrop
      </h1>

      <div className="bg-white p-8 rounded-2xl shadow-xl w-96 space-y-5">

        <h2 className="text-2xl font-bold text-center text-green-600">
          Create Account
        </h2>

        <input
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
        />

        <input
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-400"
        />

        <button
          onClick={handleSignup}
          className="w-full bg-green-500 text-white py-2 rounded-lg hover:bg-green-600"
        >
          Signup
        </button>

        <p className="text-sm text-center">
          Already have an account?{" "}
          <Link to="/login" className="text-green-500 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;