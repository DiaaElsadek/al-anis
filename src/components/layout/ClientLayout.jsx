import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import { Search, FileText, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const clientNavItems = [
  { to: "/app/providers", label: "Find Providers", icon: Search },
  { to: "/app/requests", label: "My Requests", icon: FileText },
  { to: "/app/chats", label: "Messages", icon: MessageSquare },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

export default function ClientLayout() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      {/* Secondary nav */}
      <nav className="border-b border-border/70 bg-card/60 backdrop-blur-sm sticky top-16 z-40 transition-colors">
        <div className="container flex items-center gap-1 overflow-x-auto py-1.5">
          {clientNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors whitespace-nowrap",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )
              }
            >
              <item.icon className="h-4 w-4" />
              {item.label}
            </NavLink>
          ))}
        </div>
      </nav>
      {/* Main content */}
      <main className="container py-6">
        <Outlet />
      </main>
    </div>
  );
}
