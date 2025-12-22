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
