import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

export default function ActivateAccount() {
  const { token } = useParams();
  const nav = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [msg, setMsg] = useState("Activating your account...");

  useEffect(() => {
    const activate = async () => {
      try {
        await API.get(`/auth/activate/${token}`);
        setStatus("success");
        setMsg("Your account has been activated successfully!");

        setTimeout(() => {
          nav("/login");
        }, 2500);
      } catch {
        setStatus("error");
        setMsg("This activation link is invalid or has expired.");
      }
    };

    activate();
  }, [token, nav]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">

      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-lg grid grid-cols-1 md:grid-cols-2 overflow-hidden">

        {/* LEFT – Status */}
        <div className="p-10 flex flex-col justify-center items-center text-center">

          {status === "loading" && (
            <>
              <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-6"></div>
              <h2 className="text-lg font-semibold text-gray-700">
                {msg}
              </h2>
            </>
          )}

          {status === "success" && (
            <>
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-xl font-semibold text-green-600 mb-2">
                Account Activated
              </h2>
              <p className="text-gray-600 text-sm">
                You will be redirected to the login page shortly.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="text-5xl mb-4">⚠️</div>
              <h2 className="text-xl font-semibold text-red-600 mb-2">
                Activation Failed
              </h2>
              <p className="text-gray-600 text-sm">
                {msg}
              </p>
            </>
          )}
        </div>

        {/* RIGHT – Guidance */}
        <div className="hidden md:flex flex-col justify-center bg-gray-50 p-10 border-l">

          <h3 className="text-lg font-semibold mb-4">
            What happens next?
          </h3>

          <ul className="space-y-3 text-gray-600 text-sm">
            <li>✔ Your email has been verified</li>
            <li>✔ Your account is now active</li>
            <li>✔ You can sign in securely</li>
          </ul>

          {status === "error" && (
            <button
              onClick={() => nav("/register")}
              className="mt-8 text-blue-600 text-sm hover:underline"
            >
              Create a new account
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
