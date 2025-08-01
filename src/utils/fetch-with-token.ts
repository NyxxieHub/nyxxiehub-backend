export async function fetchWithToken<T = any>(url: string): Promise<T> {
  const res = await fetch(url);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Erro na requisição:", res.status, errorText);
    throw new Error(`Request failed: ${res.status}`);
  }

  return res.json();
}
