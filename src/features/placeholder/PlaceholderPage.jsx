import { Construction } from "lucide-react";

/**
 * Generic placeholder page used during Phase 1 scaffolding.
 * Will be replaced with real implementations in later phases.
 */
export default function PlaceholderPage({ title, description }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-8">
      <Construction className="h-16 w-16 text-muted-foreground/50 mb-4" />
      <h1 className="text-2xl font-semibold text-foreground mb-2">
        {title || "Coming Soon"}
      </h1>
      <p className="text-muted-foreground max-w-md">
        {description || "This page is under construction and will be available in a future phase."}
      </p>
    </div>
  );
}
