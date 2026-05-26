import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
      {/* Clerk handles the registration flow here */}
      <SignUp path="/sign-up" signInUrl="/sign-in" fallbackRedirectUrl="/dashboard" />
    </main>
  );
}
