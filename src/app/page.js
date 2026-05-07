import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 text-center bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <main className="max-w-2xl space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl text-slate-900 dark:text-white">
          Content <span className="text-primary">Broadcasting</span>
        </h1>
        <p className="text-xl text-slate-600 dark:text-slate-400">
          A premium platform for teachers to broadcast live educational content and for principals to manage and approve broadcasts.
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg">
            <Link href="/login">Get Started</Link>
          </Button>
          <Button variant="outline" size="lg" asChild>
            <Link href="https://github.com/KeshavxA/content-broadcasting">View Source</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
