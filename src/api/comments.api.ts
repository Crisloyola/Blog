export async function deleteComment(id: number, token: string) {
    const API_URL = `http://localhost:5291/api/comments/${id}`;
    return fetch(API_URL, {
        method: "DELETE",
        headers: {
            Authorization: `Bearer ${token}`
        }
    }).then(async res => {
        if (!res.ok) {
            const errorText = await res.text();
            console.error("Delete comment error:", res.status, res.statusText, errorText);
            throw new Error(`Error al eliminar comentario: ${res.status} ${res.statusText} - ${errorText}`);
        }
    });
}

