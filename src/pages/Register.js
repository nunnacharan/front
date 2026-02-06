import { useState } from "react";
import API from "../services/api";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Register() {
  const nav = useNavigate();

  const [data, setData] = useState({});
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const register = async () => {
    try {
      setError("");

      if (data.password !== data.confirm)
        return setError("Passwords do not match");

      setLoading(true);

      await API.post("/auth/register", {
        name: data.name,
        email: data.email,
        password: data.password,
      });

      nav("/login", { replace: true });
    } catch (err) {
      setError(err.response?.data?.msg || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT – Register */}
        <div className="p-10">

          <h1 className="text-2xl font-bold text-blue-600 mb-1">
            Cloud Drive
          </h1>

          <p className="text-gray-500 mb-8">
            Create your account
          </p>

          {/* Name */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Your name"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setData({ ...data, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Email address
            </label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              Password
            </label>

            <div className="relative">
              <input
                type={show1 ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full border border-gray-300 rounded-lg p-3 pr-12
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) =>
                  setData({ ...data, password: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShow1(!show1)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {show1 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-1">
              Use at least 8 characters with letters and numbers
            </p>
          </div>

          {/* Confirm Password */}
          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">
              Confirm password
            </label>

            <div className="relative">
              <input
                type={show2 ? "text" : "password"}
                placeholder="Re-enter password"
                className="w-full border border-gray-300 rounded-lg p-3 pr-12
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) =>
                  setData({ ...data, confirm: e.target.value })
                }
              />

              <button
                type="button"
                onClick={() => setShow2(!show2)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
              >
                {show2 ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">
              {error}
            </p>
          )}

          <button
            onClick={register}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold
                       hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Creating account..." : "Create Account"}
          </button>

          <p className="text-sm text-gray-600 text-center mt-6">
            Already have an account?
            <Link to="/login" className="text-blue-600 ml-1 hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        {/* RIGHT – Info Panel */}
        <div className="hidden md:flex flex-col justify-center bg-gray-50 p-10 border-l">

          <h2 className="text-xl font-semibold mb-6">
            Why create an account?
          </h2>

          <ul className="space-y-4 text-gray-600 text-sm">
            <li>✔ Secure cloud storage powered by AWS</li>
            <li>✔ Access files from anywhere</li>
            <li>✔ Google Drive–inspired experience</li>
            <li>✔ Private and protected data</li>
          </ul>

          <p className="mt-10 text-xs text-gray-400">
            Your data is encrypted and securely stored
          </p>
        </div>
      </div>
    </div>
  );
}
