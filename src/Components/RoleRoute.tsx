import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import type { UserRole } from "../types/auth.types";

export function RoleRoute({
  children,
  allowedRoles
}: {
  children: JSX.Element;
  allowedRoles: UserRole[];
}) {
  const { role } = useAuth();

  if (!role || !allowedRoles.includes(role)) {
    return <Navigate to="/dashboard" />;
  }

  return children;
}
