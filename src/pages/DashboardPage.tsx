import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardPage() {
  const { role } = useAuth();

  if (role === "Admin") return <Navigate to="/admin" />;
  if (role === "Editor") return <Navigate to="/editor" />;
  if (role === "Reader") return <Navigate to="/reader" />;

  return null;
}
