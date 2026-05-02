import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { connectToDatabase } from '@/lib/db';
import { verifyAuthToken } from '@/lib/auth';
import { User } from '@/models/User';
import { LogoutButton } from '@/components/logout-button';

export default async function DashboardPage() {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  if (!token) {
    redirect('/auth/login');
  }

  let userId = '';
  try {
    userId = verifyAuthToken(token).id;
  } catch {
    redirect('/auth/login');
  }

  await connectToDatabase();
  const user = await User.findById(userId).select('_id username email');

  if (!user) {
    redirect('/auth/login');
  }

  return (
    <main className="min-h-screen bg-background text-foreground flex items-center justify-center px-4">
      <div className="w-full max-w-2xl rounded-xl border border-border bg-card/80 p-8 space-y-4">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome, {user.username}!</p>
        <p className="text-muted-foreground">Email: {user.email}</p>
        <LogoutButton />
      </div>
    </main>
  );
}
