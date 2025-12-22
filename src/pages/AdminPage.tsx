import { useEffect, useState } from "react";
import { getUsers, updateUserRole } from "../api/users.api";
import { createAuthor } from "../api/authors.api";
import { useAuth } from "../context/AuthContext";
import type { User } from "../types/user.types";

export default function AdminPage() {
  const { token } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [authorForm, setAuthorForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    phone: ""
  });

  useEffect(() => {
    if (token) {
      getUsers(token).then(setUsers);
    }
  }, [token]);

  const makeEditor = async (userId: number) => {
    if (!token) return;

    await updateUserRole(userId, "Editor", token);
    setUsers(prev =>
      prev.map(u =>
        u.id === userId ? { ...u, role: "Editor" } : u
      )
    );
  };

  const makeAllEditors = async () => {
    if (!token) return;

    const readers = users.filter(u => u.role === "Reader");
    for (const user of readers) {
      await updateUserRole(user.id, "Editor", token);
    }
    setUsers(prev =>
      prev.map(u =>
        u.role === "Reader" ? { ...u, role: "Editor" } : u
      )
    );
  };

  const handleCreateAuthor = async () => {
    if (!token) return;

    await createAuthor(authorForm.email, authorForm.firstName, authorForm.lastName, authorForm.phone, token);
    setShowModal(false);
    setAuthorForm({ email: "", firstName: "", lastName: "", phone: "" });
  };

  return (
    <div>
      <h2>Panel Admin</h2>
      <button onClick={() => setShowModal(true)}>Registrar Autor</button>
      <button onClick={makeAllEditors}>Hacer Editores a Todos</button>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center" }}>
          <div style={{ background: "white", padding: "20px", borderRadius: "8px" }}>
            <h3>Registrar Autor</h3>
            <input
              type="email"
              placeholder="Email"
              value={authorForm.email}
              onChange={(e) => setAuthorForm({ ...authorForm, email: e.target.value })}
            />
            <input
              type="text"
              placeholder="First Name"
              value={authorForm.firstName}
              onChange={(e) => setAuthorForm({ ...authorForm, firstName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Last Name"
              value={authorForm.lastName}
              onChange={(e) => setAuthorForm({ ...authorForm, lastName: e.target.value })}
            />
            <input
              type="text"
              placeholder="Phone"
              value={authorForm.phone}
              onChange={(e) => setAuthorForm({ ...authorForm, phone: e.target.value })}
            />
            <button onClick={handleCreateAuthor}>Crear</button>
            <button onClick={() => setShowModal(false)}>Cancelar</button>
          </div>
        </div>
      )}

      {users.map(user => (
        <div key={user.id}>
          <b>{user.email}</b> — {user.role}

          {user.role === "Reader" && (
            <button onClick={() => makeEditor(user.id)}>
              Hacer Editor
            </button>
          )}
        </div>
      ))}
    </div>
  );
}
