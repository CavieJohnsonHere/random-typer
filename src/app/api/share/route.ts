type StoreValue = {
  value: string | number | object;
  expires: number;
};

const store = new Map<string, StoreValue>();

function setWithExpiry(key: string, value: string | number | object, ttl: number) {
  const expires = Date.now() + ttl;
  store.set(key, { value, expires });
}

function getIfValid(key: string): string | number | object | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export async function POST(request: Request) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Type guard for expected shape
  if (
    typeof body !== 'object' ||
    body === null ||
    !('key' in body) ||
    !('data' in body) ||
    typeof (body as { key: unknown }).key !== 'string'
  ) {
    return new Response(
      JSON.stringify({ error: 'Key and data are required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const { key, data } = body as { key: string; data: string | number | object };
  setWithExpiry(key, data, 5 * 60 * 1000); // 5 minutes

  return new Response(
    JSON.stringify({ message: 'Data stored successfully' }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const key = searchParams.get('key');
  if (!key) {
    return new Response(
      JSON.stringify({ error: 'Key is required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
  const data = getIfValid(key);
  if (typeof data === 'undefined' || data === null) {
    return new Response(
      JSON.stringify({ error: 'Data not found or expired' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }
  return new Response(
    JSON.stringify({ data }),
    { status: 200, headers: { 'Content-Type': 'application/json' } }
  );
}
