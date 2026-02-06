import { useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const nav = useNavigate();

  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const send = async () => {
    try {
      setLoading(true);
      await API.post("/auth/forgot", { email });
      setMsg("Password reset link has been sent to your email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT – Action Panel */}
        <div className="p-10">

          <h1 className="text-2xl font-bold text-blue-600 mb-1">
            Cloud Drive
          </h1>

          <p className="text-gray-500 mb-8">
            Reset your password
          </p>

          <div className="mb-6">
            <label className="block text-sm text-gray-600 mb-1">
              Registered email address
            </label>

            <input
              type="email"
              placeholder="you@example.com"
              className="w-full border border-gray-300 rounded-lg p-3
                         focus:ring-2 focus:ring-blue-500 focus:outline-none"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <button
            onClick={send}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold
                       hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Sending link..." : "Send Reset Link"}
          </button>

          {msg && (
            <p className="text-green-600 text-sm mt-4 text-center">
              {msg}
            </p>
          )}

          <button
            onClick={() => nav("/login")}
            className="text-sm text-blue-600 mt-6 w-full hover:underline"
          >
            ← Back to Sign In
          </button>
        </div>

        {/* RIGHT – Info Panel */}
        <div className="hidden md:flex flex-col justify-center bg-gray-50 p-10 border-l">

          <h2 className="text-xl font-semibold mb-6">
            How it works
          </h2>

          <ul className="space-y-4 text-gray-600 text-sm">
            <li>✔ Enter your registered email address</li>
            <li>✔ We send a secure reset link</li>
            <li>✔ Create a new password safely</li>
          </ul>

          <p className="mt-10 text-xs text-gray-400">
            For security reasons, reset links expire automatically.
          </p>
        </div>
      </div>
    </div>
  );
}
