import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App.tsx";
import Login from "./components/Global/Login.tsx";
import ChangePassword from "./components/Password/ChangePassword.tsx";
import ProfilePage from "./components/Home/ProfilePage.tsx";
import AddEvent from "./components/Events/AddEvent.tsx";
import EventPage from "./components/Events/EventPage.tsx";
import EventDetails from "./components/Events/EventDetails.tsx";
import ParticipantsTable from "./components/Participants/ParticipantsTable.tsx";
// import EditEvent from "./components/Events/EditEvent.tsx";
import { Toaster } from "react-hot-toast";
import ProtectedRoute from "./components/Global/ProtectedRoute.tsx";
import { AuthProvider } from "./context/AuthContext.tsx";
import EventsPending from "./components/EventsPending.tsx";
import MasterAdminLayout from "./components/MasterAdminLayout.tsx";
import EventsChecked from "./components/EventsChecked.tsx";
import MasterAdminEventDetails from "./components/MasterAdminEventDetails.tsx";
import MasterAdminParticipantsTable from "./components/MasterAdminParticipantsTable.tsx";
import { ChatSection } from "./components/Chats/ChatSection.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <Toaster />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route
            path="/change-password"
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            }
          />
          <Route
            path="/update-profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-event"
            element={
              <ProtectedRoute>
                <AddEvent />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events"
            element={
              <ProtectedRoute>
                <EventPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id"
            element={
              <ProtectedRoute>
                <EventDetails />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/participants"
            element={
              <ProtectedRoute>
                <ParticipantsTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="/events/:id/edit"
            element={
              <ProtectedRoute>
                <AddEvent isEditing={true} />
              </ProtectedRoute>
            }
          />
          <Route
  path="/events/:id/chat"
  element={
    <ProtectedRoute>
     
        <ChatSection />
     
    </ProtectedRoute>
  }
/>
        
          <Route path="/master-admin" element={<MasterAdminLayout />}>
            <Route
              path="/master-admin/pending-events"
              element={<EventsPending />}
            />

            <Route
              path="/master-admin/checked-events"
              element={<EventsChecked />}
            />
            <Route path="/master-admin/events/:id" element={<MasterAdminEventDetails />} />
            <Route
              path="/master-admin/events/:id/participants"
              element={<MasterAdminParticipantsTable />}
            />
            {/* <Route path="master-admin/events/:id" element={<EventDetails />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
