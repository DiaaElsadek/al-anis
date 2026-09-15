import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { UserRole } from "@/lib/constants";
import {
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Menu,
} from "lucide-react";

export default function Navbar({ onMobileMenuToggle }) {
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const getDashboardLink = () => {
    switch (role) {
      case UserRole.ADMIN:
        return "/admin/dashboard";
      case UserRole.SERVICE_PROVIDER:
        return "/provider/dashboard";
      default:
        return "/app/providers";
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          {onMobileMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={onMobileMenuToggle}
            >
              <Menu className="h-5 w-5" />
            </Button>
          )}
          <Link to="/" className="text-xl font-bold text-primary">
            Alanis
          </Link>
        </div>

        <nav className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                      {getInitials(
                        `${user?.firstName || ""} ${user?.lastName || ""}`
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex items-center justify-start gap-2 p-2">
                  <div className="flex flex-col space-y-1 leading-none">
                    <p className="font-medium">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {user?.email}
                    </p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to={getDashboardLink()}>
                    <LayoutDashboard className="h-4 w-4 me-2" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>
                {role === UserRole.USER && (
                  <DropdownMenuItem asChild>
                    <Link to="/app/settings">
                      <Settings className="h-4 w-4 me-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                )}
                {role === UserRole.SERVICE_PROVIDER && (
                  <DropdownMenuItem asChild>
                    <Link to="/provider/profile">
                      <User className="h-4 w-4 me-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="h-4 w-4 me-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
