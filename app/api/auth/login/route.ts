import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    
    const [users] = await pool.query<any[]>(
      'SELECT * FROM user WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const user = users[0];

    
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }

    
    const token = uuidv4();
    await pool.query(
      'UPDATE user SET auth_token = ? WHERE id = ?',
      [token, user.id]
    );

    
    return NextResponse.json({ 
      message: 'Login successful',
      token: token
    }, { status: 200 });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

