type PaginatedResponse<T> = {
  data: T[];
  paging?: {
    next?: string;
  };
};

export async function fetchAllPaginated<T>(
  url: string,
  accessToken: string
): Promise<T[]> {
  const results: T[] = [];
  let nextUrl: string | null = url;

  console.log("[Meta API] URL:", url);
  console.log("[Meta API] Token:", accessToken?.slice(0, 10) + "...");

  while (nextUrl) {
    const res: Response = await fetch(nextUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (!res.ok) {
      console.error(`[Meta API] Erro ao buscar página: ${res.status}`);
      throw new Error("Erro ao buscar dados paginados do Meta API");
    }

    const json: PaginatedResponse<T> = await res.json();

    if (!Array.isArray(json.data)) {
      console.error(`[Meta API] Resposta inválida:`, json);
      throw new Error("Resposta inesperada do Meta API");
    }

    results.push(...json.data);

    nextUrl = json.paging?.next ?? null;
  }

  return results;
}
