import { Outlet, NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Navbar from "./Navbar";
import { Search, FileText, MessageSquare, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientLayout() {
  const { t } = useTranslation("common");

  const clientNavItems = [
    { to: "/app/providers", label: t("nav.findProviders"), icon: Search },
    { to: "/app/requests", label: t("nav.myRequests"), icon: FileText },
    { to: "/app/chats", label: t("nav.messages"), icon: MessageSquare },
    { to: "/app/settings", label: t("nav.settings"), icon: Settings },
  ];

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
