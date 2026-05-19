import { RegisterForm } from "./register-form";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center px-6 py-16">
      <main className="w-full max-w-md">
        <RegisterForm />
      </main>
    </div>
  );
}
