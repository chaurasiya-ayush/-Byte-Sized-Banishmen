import React, { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const Register = ({ setIsRegister }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Forging your soul-pact...");

    try {
      // Send username along with email and password
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/auth/register`,
        { username, email, password }
      );
      toast.success(data.message, { id: toastId, duration: 6000 });
      setIsRegister(false);
    } catch (error) {
      const message = error.response?.data?.message || "An error occurred.";
      toast.error(message, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-3xl font-bold text-center mb-2 text-red-500">
        Create Your Account
      </h2>
      <p className="text-center text-gray-400 mb-6">
        Sign the pact to begin your trial.
      </p>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-400 mb-2" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            required
          />
        </div>
        <div>
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
        <div>
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
            minLength="6"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-red-800"
          disabled={loading}
        >
          {loading ? "Binding..." : "Register"}
        </button>
      </form>
      <p className="text-center mt-6 text-gray-400">
        Already have an account?{" "}
        <button
          onClick={() => setIsRegister(false)}
          className="text-red-500 hover:underline font-semibold"
        >
          Login here
        </button>
      </p>
    </div>
  );
};
export default Register;
