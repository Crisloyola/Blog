import { useState } from "react";
import { createPost } from "../api/posts.api";
import { useAuth } from "../context/AuthContext";

export default function EditorPage() {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    try {
      await createPost(title, category, content, user.id, token);
      alert("Post creado!");
      setTitle("");
      setCategory("");
      setContent("");
    } catch (error) {
      alert("Error al crear post");
    }
  };

  return (
    <div>
      <h2>Crear Post</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text" 
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Categoría"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <textarea
          placeholder="Contenido"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button type="submit">Crear Post</button>
      </form>
    </div>
  );
}
