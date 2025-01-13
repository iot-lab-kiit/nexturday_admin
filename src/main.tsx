import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Login from "./components/Login.tsx";
import ChangePassword from "./components/ChangePassword.tsx";
import ProfilePage from "./components/ProfilePage.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/update-profile" element={<ProfilePage />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
