import { useEffect, useState } from "react";
import { createPost, getPosts, createComment, getComments } from "../api/posts.api";
import { useAuth } from "../context/AuthContext";

interface Post {
  id: number;
  title: string;
  category: string;
  content: string;
  publishDate: string;
  authorId: string;
}

interface Comment {
  id: number;
  commentDate: string;
  content: string;
  userName: string;
  postId: number;
}

export default function EditorPage() {
  const { token, user } = useAuth();
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = useState<Post[]>([]);
  const [comments, setComments] = useState<{ [postId: number]: Comment[] }>({});
  const [commentTexts, setCommentTexts] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    if (token) {
      getPosts(token).then(async (fetchedPosts: Post[]) => {
        setPosts(fetchedPosts);
        // Fetch comments for each post
        const commentsPromises = fetchedPosts.map(post => getComments(post.id, token));
        const commentsResults = await Promise.all(commentsPromises);
        const commentsMap: { [postId: number]: Comment[] } = {};
        fetchedPosts.forEach((post: Post, index: number) => {
          commentsMap[post.id] = commentsResults[index];
        });
        setComments(commentsMap);
      });
    }
  }, [token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !user) return;

    try {
      await createPost(title, category, content, user.id, token);
      alert("Post creado!");
      setTitle("");
      setCategory("");
      setContent("");
      // Refresh posts
      const updatedPosts = await getPosts(token);
      setPosts(updatedPosts);
    } catch (error) {
      alert("Error al crear post");
    }
  };

  const handleComment = async (postId: number) => {
    if (!token || !user) return;

    const content = commentTexts[postId];
    if (!content) return;

    try {
      const userName = `${user.firstName} ${user.lastName}`;
      await createComment(postId, content, userName, token);
      // Refresh comments for this post
      const updatedComments = await getComments(postId, token);
      setComments({ ...comments, [postId]: updatedComments });
      setCommentTexts({ ...commentTexts, [postId]: "" });
    } catch (error) {
      alert("Error al comentar");
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

      <h2>Posts Publicados</h2>
      {posts.map(post => (
        <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{post.title}</h3>
          <p><strong>Categoría:</strong> {post.category}</p>
          <p>{post.content}</p>
          <p><em>Publicado: {new Date(post.publishDate).toLocaleDateString()}</em></p>
          <h4>Comentarios:</h4>
          {comments[post.id]?.map(comment => (
            <div key={comment.id} style={{ marginLeft: "20px" }}>
              <p>{comment.content} - <em>{comment.userName} ({new Date(comment.commentDate).toLocaleDateString()})</em></p>
            </div>
          ))}
          <textarea
            placeholder="Escribe un comentario"
            value={commentTexts[post.id] || ""}
            onChange={(e) => setCommentTexts({ ...commentTexts, [post.id]: e.target.value })}
          />
          <button onClick={() => handleComment(post.id)}>Comentar</button>
        </div>
      ))}
    </div>
  );
}
