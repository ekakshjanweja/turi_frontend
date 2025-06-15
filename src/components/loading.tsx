import { Navbar } from "@/components/navbar";

export function Loading() {
  return (
    <div>
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center">
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </main>
    </div>
  );
}
