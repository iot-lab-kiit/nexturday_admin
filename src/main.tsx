import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router";
import "./index.css";
import App from "./App.tsx";
import Login from "./components/Login.tsx";
import ChangePassword from "./components/ChangePassword.tsx";
import ProfilePage from "./components/ProfilePage.tsx";
import AddEvent from "./components/AddEvent.tsx";
import EventPage from "./components/EventPage.tsx";
import EventDetails from "./components/EventDetails.tsx";
import ParticipantsTable from "./components/ParticipantsTable.tsx";
import EditEvent from "./components/EditEvent.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin-dashboard" element={<App />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/update-profile" element={<ProfilePage />} />
        <Route path="/add-event" element={<AddEvent />} />
        <Route path="/events" element={<EventPage />} />
        <Route path="/events/:id" element={<EventDetails />} />
        <Route path="/events/:id/participants" element={<ParticipantsTable />} />
        <Route path="/events/:id/edit" element={<EditEvent />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
