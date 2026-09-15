import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldX, ArrowLeft, Home } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center space-y-6 p-8">
        <div className="space-y-2">
          <ShieldX className="h-20 w-20 text-destructive mx-auto" />
          <h1 className="text-6xl font-bold text-foreground">403</h1>
          <h2 className="text-2xl font-semibold text-foreground">
            Access Denied
          </h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            You don&apos;t have permission to access this page. If you believe
            this is an error, please contact support.
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
