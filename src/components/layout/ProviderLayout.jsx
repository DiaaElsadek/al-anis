import { LayoutDashboard, User, CalendarDays, MapPin, FileText, MessageSquare } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Outlet, NavLink } from "react-router-dom";

import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";

import Navbar from "./Navbar";

export default function ProviderLayout() {
  const { t } = useTranslation("common");
  const [mobileOpen, setMobileOpen] = useState(false);

  const providerNavItems = [
    { to: "/provider/dashboard", label: t("nav.dashboard"), icon: LayoutDashboard },
    { to: "/provider/requests", label: t("nav.requests"), icon: FileText },
    { to: "/provider/chats", label: t("nav.messages"), icon: MessageSquare },
    { to: "/provider/availability", label: t("nav.availability"), icon: CalendarDays },
    { to: "/provider/working-areas", label: t("nav.workingAreas"), icon: MapPin },
    { to: "/provider/profile", label: t("nav.myProfile"), icon: User },
  ];

  function SidebarContent() {
    return (
      <nav className="flex flex-col gap-1 p-4">
        <p className="text-xs font-semibold text-muted-foreground mb-3 px-3">
          {t("nav.providerPanel")}
        </p>
        {providerNavItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors",
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
      </nav>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar onMobileMenuToggle={() => setMobileOpen(true)} />

      <div className="flex">
        {/* Desktop sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-e min-h-[calc(100vh-4rem)] bg-sidebar">
          <SidebarContent />
        </aside>

        {/* Mobile sidebar */}
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="start" className="w-64 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>

        {/* Main content */}
        <main className="flex-1 p-4 sm:p-6">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
