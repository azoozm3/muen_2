export function AuthShell({ children, compact = false }) {
  if (compact) {
    return <div className="mx-auto flex min-h-[calc(100vh-6rem)] max-w-3xl items-center justify-center px-4 py-10">{children}</div>;
  }

  return <div className="min-h-screen bg-gradient-to-br from-rose-50 via-background to-primary/5 flex items-center justify-center p-4">{children}</div>;
}
