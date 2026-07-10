const BASE_URL = 'https://api.watchfooty.st';

export async function fetchWatchFooty(path: string, revalidate: number): Promise<any> {
  const response = await fetch(`${BASE_URL}${path}`, {
    next: { revalidate },
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error(`WatchFooty API responded with status: ${response.status} for ${path}`);
  }

  return response.json();
}
