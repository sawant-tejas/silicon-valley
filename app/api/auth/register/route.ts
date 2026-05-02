import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const username = typeof body?.username === 'string' ? body.username.trim() : '';
    const email = typeof body?.email === 'string' ? body.email.trim().toLowerCase() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!username || !email || !password) {
      return NextResponse.json({ message: 'All fields are required' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({
      $or: [{ email }, { username }],
    });

    if (existingUser) {
      return NextResponse.json({ message: 'Username or email already taken' }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    await User.create({ username, email, password: hashedPassword });

    return NextResponse.json({ message: 'User registered successfully' }, { status: 201 });
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes('Missing MONGO_URI')) {
      return NextResponse.json(
        { message: 'Server setup incomplete: MONGO_URI is missing in .env.local' },
        { status: 500 }
      );
    }
    if (
      error instanceof Error &&
      (error.message.includes('ECONNREFUSED') || error.message.includes('MongooseServerSelectionError'))
    ) {
      return NextResponse.json(
        {
          message:
            'Database connection failed. Start local MongoDB on 127.0.0.1:27017 or set MONGO_URI to a MongoDB Atlas connection string.',
        },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}
