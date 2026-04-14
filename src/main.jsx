import { StrictMode } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Toaster } from "react-hot-toast";
import { Link } from "react-router-dom";
import AddExpense from "./pages/AddExpense";

import "./index.css";
import App from "./App.jsx";
import AppBar from "./containers/AppBar";
import AuthProvider from "./context/AuthContext.jsx";
import githubLogo from "/github.svg";
import SignIn from "./pages/auth/SignIn.jsx";
import SignUp from "./pages/auth/SignUp.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter> {/* ✅ MOVE TO TOP */}
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
    </BrowserRouter>

    <Toaster />
  </StrictMode>
);
   
