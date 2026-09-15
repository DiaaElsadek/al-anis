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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { getInitials, getMediaUrl } from "@/lib/utils";
import { UserRole } from "@/lib/constants";
import ThemeToggle from "@/components/shared/ThemeToggle";
import {
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  MessageSquare,
  Sparkles,
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

  const getRoleBadge = () => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 text-[10px] px-1.5 py-0">
            Admin
          </Badge>
        );
      case UserRole.SERVICE_PROVIDER:
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
            Provider
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] px-1.5 py-0">
            Client
          </Badge>
        );
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65 shadow-xs transition-colors">
      <div className="container flex h-16 items-center justify-between">
        {/* Brand & Mobile Hamburger */}
        <div className="flex items-center gap-3">
          {onMobileMenuToggle && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden h-9 w-9 rounded-lg"
              onClick={onMobileMenuToggle}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          )}

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary via-primary/90 to-emerald-400 flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                Alanis
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider -mt-1 uppercase hidden sm:block">
                الأنـيـس • Marketplace
              </span>
            </div>
          </Link>
        </div>

        {/* Right Navigation & Controls */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle Button */}
          <ThemeToggle />

          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-9 w-9 rounded-full ring-2 ring-primary/20 hover:ring-primary/40 transition-all p-0 overflow-hidden"
                >
                  <Avatar className="h-9 w-9">
                    {user?.profilePictureUrl ? (
                      <AvatarImage
                        src={getMediaUrl(user.profilePictureUrl)}
                        alt={user?.firstName || "User"}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {getInitials(
                        `${user?.firstName || ""} ${user?.lastName || ""}`
                      )}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2 border-b">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate">
                      {user?.firstName} {user?.lastName}
                    </p>
                    {getRoleBadge()}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {user?.email}
                  </p>
                </div>

                <div className="p-1">
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 me-2 text-primary" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>

                  {role === UserRole.USER && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/app/chats" className="cursor-pointer">
                          <MessageSquare className="h-4 w-4 me-2 text-primary" />
                          <span>Messages</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/app/settings" className="cursor-pointer">
                          <Settings className="h-4 w-4 me-2 text-primary" />
                          <span>Settings</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {role === UserRole.SERVICE_PROVIDER && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/provider/chats" className="cursor-pointer">
                          <MessageSquare className="h-4 w-4 me-2 text-primary" />
                          <span>Messages</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/provider/profile" className="cursor-pointer">
                          <User className="h-4 w-4 me-2 text-primary" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </div>

                <DropdownMenuSeparator />
                <div className="p-1">
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive focus:text-destructive cursor-pointer"
                  >
                    <LogOut className="h-4 w-4 me-2" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="font-medium">
                <Link to="/login">Sign In</Link>
              </Button>
              <Button size="sm" asChild className="font-medium shadow-xs">
                <Link to="/register">Get Started</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
