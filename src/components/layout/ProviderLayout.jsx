import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import Navbar from "./Navbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  User,
  CalendarDays,
  MapPin,
  FileText,
  Settings,
} from "lucide-react";

const providerNavItems = [
  { to: "/provider/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/provider/profile", label: "My Profile", icon: User },
  { to: "/provider/availability", label: "Availability", icon: CalendarDays },
  { to: "/provider/working-areas", label: "Working Areas", icon: MapPin },
  { to: "/provider/requests", label: "Requests", icon: FileText },
];

function SidebarContent() {
  return (
    <nav className="flex flex-col gap-1 p-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
        Provider Panel
      </p>
      {providerNavItems.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
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

export default function ProviderLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);

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
        <main className="flex-1 p-6">
          <div className="max-w-5xl mx-auto">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
