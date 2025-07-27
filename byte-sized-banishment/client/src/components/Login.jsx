import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const Login = ({ setIsRegister, setShowModal, setIsForgotPassword }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Logging in...");
    try {
      const data = await login(email, password);
      toast.success(data.message, { id: toastId });
      setShowModal(false);
      navigate("/dashboard");
    } catch (error) {
      const message =
        error.response?.data?.message || "An error occurred during login.";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-2 text-red-500">
        Welcome Back
      </h2>
      <p className="text-center text-gray-400 mb-6">
        Enter your credentials to face the Devil.
      </p>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-400 mb-2" htmlFor="email">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-400 mb-2" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
          <div className="text-right mt-2">
            <button
              type="button"
              onClick={() => setIsForgotPassword(true)}
              className="text-red-400 hover:text-red-300 text-sm font-medium transition-colors duration-200"
            >
              Forgot Password?
            </button>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-red-800"
          disabled={loading}
        >
          {loading ? "Entering the Abyss..." : "Login"}
        </button>
      </form>
      <p className="text-center mt-6 text-gray-400">
        New to the challenge?{" "}
        <button
          onClick={() => setIsRegister(true)}
          className="text-red-500 hover:underline font-semibold"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default Login;
