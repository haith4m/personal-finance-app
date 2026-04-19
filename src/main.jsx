import { StrictMode, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { createRoot } from "react-dom/client";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import CssBaseline from "@mui/material/CssBaseline";
import ThemeProvider from "@mui/material/styles/ThemeProvider";
import { Toaster } from "react-hot-toast";

import "./index.css";
import App from "./App.jsx";
import Home from "./pages/Home";
import Reports from "./pages/Reports";
import Goals from "./pages/Goals";
import Transactions from "./pages/Transactions";
import Budgets from "./pages/Budgets";
import SignIn from "./pages/auth/SignIn";
import SignUp from "./pages/auth/SignUp";

import AppBar from "./containers/AppBar";
<<<<<<< HEAD
import AuthProvider from "./context/AuthContext.jsx";
import { ColorModeProvider } from "./context/ThemeContext.jsx";
import githubLogo from "/github.svg";
import SignIn from "./pages/auth/SignIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ MOVE TO TOP */}
      <ColorModeProvider>
        <AuthProvider>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            margin: "1rem",
          }}
        >
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
            }}
          >
            <AppBar />

            <Routes>
              <Route path="/" element={<App />} />
              <Route path="/auth/sign-in" element={<SignIn />} />
              <Route path="/auth/sign-up" element={<SignUp />} />
              <Route path="/add-expense" element={<AddExpense />} />
            </Routes>
          </div>

          <footer
            style={{
              padding: "1rem",
              textAlign: "center",
            }}
          >
            
          </footer>
        </div>

      </AuthProvider>
      </ColorModeProvider>
    </BrowserRouter>

    <Toaster />
=======
import AuthProvider from "./context/AuthContext";
import { useAuth } from "./hooks/useAuth";
import QuickAddModal from "./components/QuickAddModal";
import getAppTheme from "./theme";

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>;
  if (!user) return <Navigate to="/" />;

  return children;
}

function ScrollProgress() {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setWidth(max > 0 ? (doc.scrollTop / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return <div className="scroll-progress" style={{ width: `${width}%` }} aria-hidden="true" />;
}

function Layout({ mode, onToggleTheme }) {
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);

  return (
    <div>
      <div className="bg-orbs" aria-hidden="true" />
      <ScrollProgress />
      <div style={{ position: "relative", zIndex: 1 }}>
      <AppBar mode={mode} onToggleTheme={onToggleTheme} />

      <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/auth/sign-in" element={<SignIn />} />
          <Route path="/auth/sign-up" element={<SignUp />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />

          <Route
            path="/transactions"
            element={
              <ProtectedRoute>
                <Transactions />
              </ProtectedRoute>
            }
          />

          <Route
            path="/budgets"
            element={
              <ProtectedRoute>
                <Budgets />
              </ProtectedRoute>
            }
          />

          <Route
            path="/goals"
            element={
              <ProtectedRoute>
                <Goals />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>

      {user && (
        <>
          <button className="fab" onClick={() => setShowModal(true)} title="Add expense" aria-label="Add expense">
            <AddRoundedIcon />
          </button>
          {showModal && <QuickAddModal onClose={() => setShowModal(false)} />}
        </>
      )}
      </div>
    </div>
  );
}

function AppRoot() {
  const [mode, setMode] = useState(() => localStorage.getItem("theme-mode") || "light");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", mode);
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  const theme = getAppTheme(mode);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthProvider>
          <Layout mode={mode} onToggleTheme={() => setMode((current) => (current === "light" ? "dark" : "light"))} />
        </AuthProvider>
      </BrowserRouter>
      <Toaster
        toastOptions={{
          style: {
            background: mode === "light" ? "#fbf5ea" : "#1d1713",
            color: mode === "light" ? "#181512" : "#f3e8d5",
            border: mode === "light" ? "1px solid rgba(33, 27, 23, 0.16)" : "1px solid rgba(243, 232, 213, 0.18)",
            boxShadow: mode === "light" ? "6px 6px 0 rgba(33, 27, 23, 0.12)" : "6px 6px 0 rgba(0, 0, 0, 0.3)",
          },
        }}
      />
    </ThemeProvider>
  );
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AppRoot />
>>>>>>> ef6a9ec (UI overhaul, reports, goals, theme consistency, validation improvements)
  </StrictMode>
);
