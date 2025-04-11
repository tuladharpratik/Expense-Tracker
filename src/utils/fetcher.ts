// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default async function fetcher(endpoint: string, method: string, tag?: string, body?: any) {
  const url = process.env.NODE_ENV === 'production' ? endpoint : `http://localhost:3000/${endpoint}`;

  // Pass the session token in the Authorization header
  const response = await fetch(url, {
    next: { tags: tag ? [tag] : [] },
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify({ data: body }) : null,
    cache: 'no-store',
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Request failed: ${errorText}`);
  }

  return response.json();
}
