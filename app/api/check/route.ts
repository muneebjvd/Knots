import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 });
  }

  const cleanUsername = username.trim().toLowerCase();

  // Validate Instagram rules
  const usernameRegex = /^[a-zA-Z0-9._]{1,30}$/;
  if (!usernameRegex.test(cleanUsername)) {
    return NextResponse.json({ error: 'Invalid characters in username' }, { status: 400 });
  }

  try {
    const url = `https://www.instagram.com/${cleanUsername}/`;
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'en-US,en;q=0.9',
      },
      next: { revalidate: 0 } // Prevent caching
    });

    if (response.status === 404) {
      return NextResponse.json({ username: cleanUsername, available: true, status: 'available' });
    } else if (response.status === 200) {
      if (response.url.includes('login')) {
        return NextResponse.json({ username: cleanUsername, available: null, status: 'rate_limited' });
      }
      return NextResponse.json({ username: cleanUsername, available: false, status: 'taken' });
    } else if (response.status === 429) {
      return NextResponse.json({ username: cleanUsername, available: null, status: 'rate_limited' });
    } else {
      return NextResponse.json({ username: cleanUsername, available: null, status: 'error', code: response.status });
    }
  } catch (error: any) {
    return NextResponse.json({ username: cleanUsername, available: null, status: 'error', message: error.message });
  }
}
