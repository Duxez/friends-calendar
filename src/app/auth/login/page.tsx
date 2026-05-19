import Link from "next/link";
import { enabledSocialProviders } from "@/auth";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <main className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Log in</h1>
        <p className="mt-2 text-sm text-zinc-600">Use your email and password to sign in.</p>
        <LoginForm socialProviders={enabledSocialProviders} />
        <p className="mt-6 text-sm text-zinc-600">
          Don&apos;t have an account?{" "}
          <Link href="/auth/register" className="font-medium text-zinc-900 underline">
            Create one
          </Link>
        </p>
      </main>
    </div>
  );
}
