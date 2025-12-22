import { useEffect, useState } from "react";
import { getPosts, createComment, getComments } from "../api/posts.api";
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

export default function ReaderPage() {
  const { token, user } = useAuth();
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
      <h2>Posts</h2>
      {posts.map(post => (
        <div key={post.id} style={{ border: "1px solid #ccc", margin: "10px", padding: "10px" }}>
          <h3>{post.title}</h3>
          <p><strong>Categoría:</strong> {post.category}</p>
          <p>{post.content}</p>
          <p><em>Publicado: {new Date(post.publishDate).toLocaleDateString()} por Autor ID: {post.authorId}</em></p>
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
