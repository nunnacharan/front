import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login() {
  const nav = useNavigate();

  const [data, setData] = useState({});
  const [remember, setRemember] = useState(false);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await API.post("/auth/login", data);

      const expiry = remember
        ? Date.now() + 7 * 24 * 60 * 60 * 1000
        : Date.now() + 30 * 60 * 1000;

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("expiry", expiry);

      nav("/dashboard", { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT – Login */}
        <div className="p-10">

          <h1 className="text-2xl font-bold text-blue-600 mb-1">
            Cloud Drive
          </h1>

          <p className="text-gray-500 mb-8">
            Sign in to continue
          </p>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@company.com"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="mb-3">
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={show ? "text" : "password"}
                placeholder="••••••••"
                className="w-full border border-gray-300 rounded-lg p-3 pr-12
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShow(!show)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {show ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center mb-4 text-sm">
            <label className="flex items-center text-gray-600">
              <input
                type="checkbox"
                className="mr-2"
                onChange={() => setRemember(!remember)}
              />
              Remember me
            </label>

            <button
              onClick={() => nav("/forgot")}
              className="text-blue-600 hover:underline"
            >
              Forgot?
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <button
            onClick={login}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold
                       hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-6">
            New user?
            <Link to="/register" className="text-blue-600 ml-1 hover:underline">
              Create account
            </Link>
          </p>
        </div>

        {/* RIGHT – Value Panel */}
        <div className="hidden md:flex flex-col justify-center bg-gray-50 p-10 border-l">

          <h2 className="text-xl font-semibold mb-6">
            Why Cloud Drive?
          </h2>

          <ul className="space-y-4 text-gray-600 text-sm">
            <li>✔ Secure file storage using AWS S3</li>
            <li>✔ Access files from anywhere</li>
            <li>✔ Clean Google Drive–like experience</li>
            <li>✔ Built with React & Node.js</li>
          </ul>

          <p className="mt-10 text-xs text-gray-400">
            Designed for enterprise-ready file management
          </p>
        </div>
      </div>
    </div>
  );
}
