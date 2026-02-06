import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token");
  const expiry = localStorage.getItem("expiry");

  if (!token || Date.now() > expiry) {
    localStorage.clear();
    return <Navigate to="/login" replace />;
  }

  return children;
}
