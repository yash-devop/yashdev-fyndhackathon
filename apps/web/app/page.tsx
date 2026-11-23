import { ThemeToggle } from "@/components/theme-toggle";

export default function Home() {
  return (
    <main className="relative flex min-h-svh flex-col items-center justify-center gap-6 p-8">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      <h1 className="text-4xl font-semibold tracking-tight">yash-fynd</h1>
      <p className="text-muted-foreground max-w-md text-center text-balance">
        Monorepo starter with Next.js, Express, Prisma and a shared UI package.
        Start building here.
      </p>
    </main>
  );
}
