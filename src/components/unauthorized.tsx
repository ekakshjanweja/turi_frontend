import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";

export function Unauthorized() {
  return (
    <div>
      <main className="flex items-center justify-center min-h-[calc(100vh-80px)]">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Not Signed In</h1>
          <p className="text-muted-foreground">
            Please sign in to view your profile
          </p>
          <Button onClick={() => (window.location.href = "/")}>
            Go to Home
          </Button>
        </div>
      </main>
    </div>
  );
}
