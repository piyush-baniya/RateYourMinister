import React, { useState } from "react";
import { supabase } from "../supabaseClient";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Logged in successfully!");
        navigate("/");
      }
    } catch (error) {
      toast.error("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4">
      <form
        onSubmit={handleLogin}
        className="bg-gray-900/70 backdrop-blur-sm shadow-2xl rounded-lg px-8 pt-6 pb-8 mb-4 border border-gray-700"
      >
        <h2 className="text-2xl text-white font-bold mb-6 text-center">
          Login
        </h2>
        <div className="mb-4">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="email"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full bg-gray-800 text-white rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
            required
          />
        </div>
        <div className="mb-6">
          <label
            className="block text-gray-300 text-sm font-bold mb-2"
            htmlFor="password"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full bg-gray-800 text-white rounded py-2 px-3 leading-tight focus:outline-none focus:ring-2 focus:ring-purple-500 border border-gray-700"
            required
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:bg-purple-400 transition-colors"
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <p className="text-center text-gray-400 text-sm mt-4">
          Don't have an account?{" "}
          <Link to="/signup" className="text-purple-400 hover:text-purple-300">
            Sign Up
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
