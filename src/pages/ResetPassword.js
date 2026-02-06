import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function ResetPassword() {
  const { token } = useParams();
  const nav = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);

  const [msg, setMsg] = useState("");
  const [status, setStatus] = useState(""); // success | error
  const [loading, setLoading] = useState(false);

  const reset = async () => {
    try {
      setMsg("");
      setStatus("");

      if (password !== confirm) {
        setStatus("error");
        return setMsg("Passwords do not match");
      }

      setLoading(true);

      await API.post(`/auth/reset/${token}`, { password });

      setStatus("success");
      setMsg("Your password has been updated successfully.");

      setTimeout(() => {
        nav("/login", { replace: true });
      }, 2000);
    } catch {
      setStatus("error");
      setMsg("Reset link is invalid or has expired.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-5xl rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT – Reset Form */}
        <div className="p-10">

          <h1 className="text-2xl font-bold text-blue-600 mb-1">
            Cloud Drive
          </h1>

          <p className="text-gray-500 mb-8">
            Set a new password
          </p>

          {/* New Password */}
          <div className="mb-4">
            <label className="block text-sm text-gray-600 mb-1">
              New password
            </label>

            <div className="relative">
              <input
                type={show1 ? "text" : "password"}
                placeholder="Create a strong password"
                className="w-full border border-gray-300 rounded-lg p-3 pr-12
                           focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) => setPassword(e.target.value)}
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
                onChange={(e) => setConfirm(e.target.value)}
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

          {msg && (
            <p
              className={`text-sm text-center mb-4 ${
                status === "success" ? "text-green-600" : "text-red-500"
              }`}
            >
              {msg}
            </p>
          )}

          <button
            onClick={reset}
            disabled={loading}
            className="bg-blue-600 text-white w-full py-3 rounded-lg font-semibold
                       hover:bg-blue-700 transition disabled:opacity-60"
          >
            {loading ? "Updating password..." : "Reset Password"}
          </button>
        </div>

        {/* RIGHT – Security Info */}
        <div className="hidden md:flex flex-col justify-center bg-gray-50 p-10 border-l">

          <h2 className="text-xl font-semibold mb-6">
            Password security tips
          </h2>

          <ul className="space-y-4 text-gray-600 text-sm">
            <li>✔ Use a unique password</li>
            <li>✔ Avoid personal information</li>
            <li>✔ Do not reuse old passwords</li>
          </ul>

          <p className="mt-10 text-xs text-gray-400">
            Your password is securely encrypted.
          </p>
        </div>
      </div>
    </div>
  );
}
