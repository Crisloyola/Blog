import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import AdminPage from "./pages/AdminPage";
import EditorPage from "./pages/EditorPage";
import ReaderPage from "./pages/ReaderPage";
import { ProtectedRoute } from "./Components/ProtectedRoute";
import { RoleRoute } from "./Components/RoleRoute";
import "./index.css"
import Settings from "./pages/settings";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/settings" element={<Settings />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["Admin"]}>
              <AdminPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/editor"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["Editor"]}>
              <EditorPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />

      <Route
        path="/reader"
        element={
          <ProtectedRoute>
            <RoleRoute allowedRoles={["Reader"]}>
              <ReaderPage />
            </RoleRoute>
          </ProtectedRoute>
        }
      />


    </Routes>
  );
}
