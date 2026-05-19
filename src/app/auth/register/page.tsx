import Link from "next/link";
import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 px-6 py-16">
      <main className="w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-8 shadow-sm">
        <h1 className="text-2xl font-semibold tracking-tight text-zinc-900">Create account</h1>
        <p className="mt-2 text-sm text-zinc-600">Set up your account to use Friends Calendar.</p>
        <RegisterForm />
        <p className="mt-6 text-sm text-zinc-600">
          Already have an account?{" "}
          <Link href="/auth/login" className="font-medium text-zinc-900 underline">
            Log in
          </Link>
        </p>
      </main>
    </div>
  );
}
