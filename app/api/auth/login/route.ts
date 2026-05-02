import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db';
import { signAuthToken } from '@/lib/auth';
import { User } from '@/models/User';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const identifier = typeof body?.identifier === 'string' ? body.identifier.trim() : '';
    const password = typeof body?.password === 'string' ? body.password : '';

    if (!identifier || !password) {
      return NextResponse.json({ message: 'Identifier and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    });

    if (!user) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ message: 'Invalid credentials' }, { status: 400 });
    }

    const token = signAuthToken({ id: user._id.toString() });
    const response = NextResponse.json(
      {
        user: {
          id: user._id.toString(),
          username: user.username,
          email: user.email,
        },
      },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error(error);
    if (error instanceof Error && error.message.includes('Missing MONGO_URI')) {
      return NextResponse.json(
        { message: 'Server setup incomplete: MONGO_URI is missing in .env.local' },
        { status: 500 }
      );
    }
    if (error instanceof Error && error.message.includes('Missing JWT_SECRET')) {
      return NextResponse.json(
        { message: 'Server setup incomplete: JWT_SECRET is missing in .env.local' },
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
