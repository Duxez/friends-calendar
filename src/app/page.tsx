import Link from "next/link";
import { auth } from "@/auth";
import { LogoutButton } from "@/components/logout-button";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-50 px-6 py-16">
      <main className="w-full max-w-2xl rounded-2xl border border-zinc-200 bg-white p-10 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-900">
          Friends Calendar
        </h1>
        {user ? (
          <div className="mt-8 space-y-4">
            <p className="text-zinc-700">
              Signed in as <strong>{user.name ?? user.email}</strong>
            </p>
            <p className="text-sm text-zinc-500">Email: {user.email ?? "N/A"}</p>
            <LogoutButton />
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            <p className="text-zinc-600">
              Sign in to access your account and start managing your calendar.
            </p>
            <Link
              href="/auth/login"
              className="inline-flex rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700"
            >
              Log in
            </Link>
          </div>
        )}
        <div className="mt-8 rounded-xl bg-zinc-100 p-4 text-sm text-zinc-600">
          JWT auth is handled by the application database with optional social login providers.
        </div>
      </main>
    </div>
  );
}
