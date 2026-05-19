import { enabledSocialProviders } from "@/auth";
import { LoginForm } from "./login-form";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <main className="w-full max-w-md">
        <LoginForm socialProviders={enabledSocialProviders} />
      </main>
    </div>
  );
}
