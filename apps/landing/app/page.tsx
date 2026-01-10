import { Button } from "@ralph/ui";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl space-y-8 text-center">
        <h1 className="text-5xl font-bold tracking-tight text-gray-900">
          Hello <span className="text-brand-600">Ralph Alpha</span>
        </h1>

        <p className="text-xl text-gray-600">
          A modern monorepo built with Bun, Turborepo, Next.js 15, and Tailwind
          CSS v4.
        </p>

        <div className="flex justify-center gap-4">
          <Button variant="primary" size="lg">
            Get Started
          </Button>
          <Button variant="outline" size="lg">
            Learn More
          </Button>
        </div>
      </div>
    </main>
  );
}
