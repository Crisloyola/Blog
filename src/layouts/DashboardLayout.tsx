import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DashboardLayout() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      
      {/* Sidebar */}
      <aside style={{ width: "220px", background: "#222", color: "#fff", padding: "20px" }}>
        <h3>BlogApp</h3>
        <ul>
          <li onClick={() => navigate("/dashboard")}>Dashboard</li>
          <li onClick={() => navigate("/authors")}>Authors</li>
          <li onClick={() => navigate("/posts")}>Posts</li>
          <li onClick={handleLogout}>Logout</li>
        </ul>
      </aside>

      {/* Contenido */}
      <main style={{ flex: 1, padding: "20px" }}>
        <Outlet />
      </main>

    </div>
  );
}
