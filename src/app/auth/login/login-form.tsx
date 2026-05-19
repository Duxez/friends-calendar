"use client";

import { FormEvent, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import type { SocialProvider } from "@/auth";

type LoginFormProps = {
  socialProviders: SocialProvider[];
};

export function LoginForm({ socialProviders }: LoginFormProps) {
  const router = useRouter();

  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const getCallbackUrl = () => {
    if (typeof window === "undefined") {
      return "/";
    }

    const searchParams = new URLSearchParams(window.location.search);
    return searchParams.get("callbackUrl") ?? "/";
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = String(formData.get("email") ?? "").trim();
    const password = String(formData.get("password") ?? "");
    const callbackUrl = getCallbackUrl();

    startTransition(async () => {
      const result = await signIn("credentials", {
        email,
        password,
        callbackUrl,
        redirect: false,
      });

      if (!result || result.error) {
        setError("Invalid email or password.");
        return;
      }

      router.push(result.url ?? callbackUrl);
      router.refresh();
    });
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <label className="block text-sm font-medium text-zinc-700" htmlFor="email">
        Email
      </label>
      <input
        id="email"
        name="email"
        type="email"
        required
        autoComplete="email"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-300 focus:ring"
      />

      <label className="block text-sm font-medium text-zinc-700" htmlFor="password">
        Password
      </label>
      <input
        id="password"
        name="password"
        type="password"
        required
        autoComplete="current-password"
        className="w-full rounded-lg border border-zinc-300 px-3 py-2 text-zinc-900 outline-none ring-zinc-300 focus:ring"
      />

      {error ? <p className="text-sm text-red-600">{error}</p> : null}

      <button
        type="submit"
        disabled={isPending}
        className="w-full rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isPending ? "Signing in..." : "Sign in"}
      </button>

      {socialProviders.length > 0 ? (
        <div className="space-y-2">
          <p className="text-xs uppercase tracking-wide text-zinc-500">or continue with</p>
          {socialProviders.map((provider) => (
            <button
              key={provider.id}
              type="button"
              disabled={isPending}
              onClick={() => signIn(provider.id, { callbackUrl: getCallbackUrl() })}
              className="w-full rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-zinc-900 transition hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-70"
            >
              Continue with {provider.label}
            </button>
          ))}
        </div>
      ) : null}
    </form>
  );
}
