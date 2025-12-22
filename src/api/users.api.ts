import { User } from "../types/user.types";
import type { UserRole } from "../types/roles.types";

const API_URL = "http://localhost:5291/api/users";

export async function getUsers(token: string): Promise<User[]> {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) throw new Error("Error al obtener usuarios");
  return res.json();
}

export async function updateUserRole(
  userId: number,
  role: UserRole,
  token: string
) {
  const res = await fetch(`${API_URL}/${userId}/role`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(role)
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al cambiar rol: ${res.status} ${res.statusText} - ${errorText}`);
  }
}
