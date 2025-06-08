type StoreValue = {
  value: any;
  expires: number;
};

const store = new Map<string, StoreValue>();

function setWithExpiry(key: string, value: any, ttl: number) {
  const expires = Date.now() + ttl;
  store.set(key, { value, expires });
}

function getIfValid(key: string): any | null {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expires) {
    store.delete(key);
    return null;
  }
  return entry.value;
}

export async function POST(request: Request) {
  try {
    const { key, data }: { key?: string; data?: any } = await request.json();
    if (!key || typeof data === 'undefined') {
      return new Response(
        JSON.stringify({ error: 'Key and data are required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }
    setWithExpiry(key, data, 5 * 60 * 1000); // 5 minutes
    return new Response(
      JSON.stringify({ message: 'Data stored successfully' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (err) {
    return new Response(
      JSON.stringify({ error: 'Invalid JSON' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }
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
