import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function GET() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get('authToken')?.value;

  if (!authToken) {
    return NextResponse.json({ authenticated: false, message: 'No auth token found' }, { status: 401 });
  }

  try {
    const decoded = jwt.verify(authToken, process.env.JWT_SECRET as string) as { userId: string, email: string, username: string };
    return NextResponse.json({ authenticated: true, user: decoded }, { status: 200 });
  } catch (error) {
    console.error('Token verification failed:', error);
    return NextResponse.json({ authenticated: false, message: 'Invalid token' }, { status: 401 });
  }
}

