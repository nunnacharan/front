import { BrowserRouter, Routes, Route } from "react-router-dom";

/* ================= PAGES ================= */
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ActivateAccount from "./pages/ActivateAccount";

/* ================= ROUTE GUARDS ================= */
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

/* ================= THEME (Dark Mode) ================= */
import { ThemeProvider } from "./context/Theme";

/* ================= TOASTS ================= */
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <ThemeProvider>
      <BrowserRouter>

        {/* Toast popup container */}
        <Toaster position="top-right" />

        <Routes>

          {/* ================= PUBLIC ROUTES ================= */}

          {/* Home */}
          <Route
            path="/"
            element={
              <PublicRoute>
                <Home />
              </PublicRoute>
            }
          />

          {/* Login */}
          <Route
            path="/login"
            element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            }
          />

          {/* Register */}
          <Route
            path="/register"
            element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            }
          />

          {/* Forgot Password */}
          <Route
            path="/forgot"
            element={
              <PublicRoute>
                <ForgotPassword />
              </PublicRoute>
            }
          />

          {/* Reset Password */}
          <Route
            path="/reset/:token"
            element={
              <PublicRoute>
                <ResetPassword />
              </PublicRoute>
            }
          />

          {/* Activate Account */}
          <Route
            path="/activate/:token"
            element={
              <PublicRoute>
                <ActivateAccount />
              </PublicRoute>
            }
          />


          {/* ================= PRIVATE ROUTES ================= */}

          {/* Dashboard */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />


          {/* ================= FALLBACK ================= */}

          {/* Any unknown path → Home */}
          <Route path="*" element={<Home />} />

        </Routes>

      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
