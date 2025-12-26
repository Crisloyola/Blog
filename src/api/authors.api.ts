
export async function createAuthor(
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  token: string
) {
  const res = await fetch("http://localhost:5291/api/authors", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, firstName, lastName, phone }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al crear autor: ${res.status} ${res.statusText} - ${errorText}`);
  }
}

export async function getAuthorByEmail(email: string, token: string) {
  const res = await fetch(`http://localhost:5291/api/authors/email/${email}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Author not found");
  return await res.json();
}


export async function editAuthor(
  id: string,
  email: string,
  firstName: string,
  lastName: string,
  phone: string,
  token: string
) {
  const res = await fetch(`http://localhost:5291/api/authors/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email, firstName, lastName, phone }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Error al editar autor: ${res.status} - ${errorText}`);
  }

  // 👇 ESTO ES CLAVE
  return await res.json();
}
