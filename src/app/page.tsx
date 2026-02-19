import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6 text-center">
      {/* Hero */}
      <div className="flex flex-col items-center gap-6 max-w-xl">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-orange-500 text-white text-3xl shadow-lg shadow-orange-500/30">
          🏋️
        </div>

        <h1 className="text-5xl font-bold tracking-tight text-white">
          Lifting Diary
        </h1>

        <p className="text-lg text-zinc-400 leading-relaxed">
          Track every rep, every set, every session. Build strength with data
          that moves with you.
        </p>

        <SignedOut>
          <div className="flex gap-3 mt-2">
            <SignUpButton mode="modal">
              <button className="rounded-full bg-orange-500 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-400 active:scale-95">
                Get started free
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="rounded-full border border-zinc-700 px-6 py-3 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white active:scale-95">
                Sign in
              </button>
            </SignInButton>
          </div>
        </SignedOut>

        <SignedIn>
          <a
            href="/dashboard"
            className="mt-2 rounded-full bg-orange-500 px-8 py-3 text-sm font-semibold text-white shadow-md shadow-orange-500/30 transition hover:bg-orange-400 active:scale-95"
          >
            Go to dashboard →
          </a>
        </SignedIn>
      </div>

      {/* Feature pills */}
      <div className="mt-20 flex flex-wrap justify-center gap-3 text-sm text-zinc-500">
        {["Log workouts", "Track exercises", "Monitor progress", "Multiple sets"].map(
          (f) => (
            <span
              key={f}
              className="rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5"
            >
              {f}
            </span>
          )
        )}
      </div>
    </main>
  );
}
