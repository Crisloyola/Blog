import { Comment } from "../types/comment.types";
const API_URL = "http://localhost:5291/api/posts";


export async function createPost(title: string, category: string, content: string, authorId: string, token: string) {
  const body = { Title: title, Category: category, Content: content, AuthorId: authorId, PublishDate: new Date().toISOString() };
  console.log("Creating post with body:", body);
  const res = await fetch(API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create post error:", res.status, res.statusText, errorText);
    throw new Error(`Error al crear post: ${res.status} ${res.statusText} - ${errorText}`);
  }
}

export async function getPosts(token: string) {
  const res = await fetch(API_URL, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener posts: ${res.status} ${res.statusText} - ${errorText}`);
  }
  return res.json();
}

export async function getComments(postId: number, token: string) {
  const res = await fetch("http://localhost:5291/api/comments", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al obtener comentarios: ${res.status} ${res.statusText} - ${errorText}`);
  }
  const allComments: Comment[] = await res.json();
  return allComments.filter(comment => comment.postId === postId);
}

export async function createComment(postId: number, content: string, userName: string, token: string) {
  const body = { Content: content, UserName: userName, PostId: postId, CommentDate: new Date().toISOString() };
  console.log("Creating comment with body:", body);
  const res = await fetch("http://localhost:5291/api/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    },
    body: JSON.stringify(body)
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Create comment error:", res.status, res.statusText, errorText);
    throw new Error(`Error al crear comentario: ${res.status} ${res.statusText} - ${errorText}`);
  }
}

export async function deletePost(postId: number, token: string) {
  const res = await fetch(`${API_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  if (!res.ok) {
    const errorText = await res.text();
    console.error("Delete post error:", res.status, res.statusText, errorText);
    throw new Error(`Error al eliminar post: ${res.status} ${res.statusText} - ${errorText}`);
  }
}
