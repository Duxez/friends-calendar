import { auth } from "@/auth";
import { ProfileCard } from "@/components/profile-card";

export default async function Home() {
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex flex-1 items-center justify-center px-6 py-16">
      <main className="w-full max-w-2xl">
        <ProfileCard
          signedIn={Boolean(user)}
          name={user?.name ?? user?.email ?? "Unknown user"}
          email={user?.email ?? "N/A"}
        />
      </main>
    </div>
  );
}
