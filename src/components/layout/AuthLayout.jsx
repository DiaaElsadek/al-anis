import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-primary">Alanis</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Your trusted service marketplace
          </p>
        </div>
        <Outlet />
      </div>
    </div>
  );
}
