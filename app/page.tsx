export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <main className="flex flex-col items-center gap-8">
        <h1 className="text-4xl font-bold tracking-tight">
          Welcome to Beelia.ai
        </h1>
        <p className="text-lg text-muted-foreground text-center max-w-2xl">
          Your AI marketplace for discovering and using powerful AI tools
        </p>
      </main>
    </div>
  );
}
