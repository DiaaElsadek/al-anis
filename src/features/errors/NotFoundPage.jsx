import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold text-primary">404</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Page Not Found
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The page you&apos;re looking for doesn&apos;t exist or has been
            moved.
          </p>
        </div>
        <div className="flex items-center justify-center gap-4">
          <Button variant="outline" onClick={() => window.history.back()}>
            <ArrowLeft className="h-4 w-4 me-2" />
            Go Back
          </Button>
          <Button asChild>
            <Link to="/">
              <Home className="h-4 w-4 me-2" />
              Home
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
