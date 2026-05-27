"use client";

export const dynamic = "force-dynamic";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground p-4">
        <div className="max-w-md w-full text-center space-y-4">
          <h2 className="text-2xl font-serif font-bold">Something went wrong!</h2>
          <p className="text-sm text-muted-foreground font-mono bg-muted p-3 rounded-lg overflow-auto max-h-40">
            {error?.message || "An unexpected error occurred."}
          </p>
          <button
            onClick={() => reset()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 text-sm font-medium transition-colors"
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
