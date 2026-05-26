import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen w-full items-center justify-center bg-zinc-950">
      {/* Clerk handles the entire form card automatically */}
      <SignIn 
        path="/sign-in" 
        signUpUrl="/sign-up"
        fallbackRedirectUrl="/dashboard" 
      />
    </main>
  );
}