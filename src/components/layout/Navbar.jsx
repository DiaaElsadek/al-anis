import {
  LogOut,
  User,
  Settings,
  LayoutDashboard,
  Menu,
  ShieldCheck,
  MessageSquare,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Link, useNavigate } from "react-router-dom";

import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import ThemeToggle from "@/components/shared/ThemeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { UserRole } from "@/lib/constants";
import { getInitials, getMediaUrl } from "@/lib/utils";

export default function Navbar({ onMobileMenuToggle }) {
  const { t } = useTranslation("common");
  const { user, isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const displayName =
    user?.fullName ||
    user?.name ||
    (user?.firstName && user?.lastName
      ? `${user.firstName} ${user.lastName}`.trim()
      : user?.firstName || user?.email?.split("@")[0] || t("roles.user"));

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
        return "/app/dashboard";
    }
  };

  const getRoleBadge = () => {
    switch (role) {
      case UserRole.ADMIN:
        return (
          <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20 text-[10px] px-1.5 py-0">
            {t("roles.admin")}
          </Badge>
        );
      case UserRole.SERVICE_PROVIDER:
        return (
          <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px] px-1.5 py-0">
            {t("roles.serviceProvider")}
          </Badge>
        );
      default:
        return (
          <Badge className="bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20 text-[10px] px-1.5 py-0">
            {t("roles.user")}
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
            <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground shadow-xs group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-foreground">
                {t("brand.name")}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider uppercase hidden sm:block">
                {t("brand.subtitle")}
              </span>
            </div>
          </Link>
        </div>

        {/* Right Navigation & Controls */}
        <nav className="flex items-center gap-2 sm:gap-3">
          {/* Language Switcher */}
          <LanguageSwitcher />

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
                    {user?.profilePictureUrl || user?.profilePicture ? (
                      <AvatarImage
                        src={getMediaUrl(user.profilePictureUrl || user.profilePicture)}
                        alt={displayName}
                        className="object-cover"
                      />
                    ) : null}
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                      {getInitials(displayName)}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <div className="flex flex-col space-y-1 p-2 border-b">
                  <div className="flex items-center justify-between">
                    <p className="font-semibold text-sm truncate">{displayName}</p>
                    {getRoleBadge()}
                  </div>
                  <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                </div>

                <div className="p-1">
                  <DropdownMenuItem asChild>
                    <Link to={getDashboardLink()} className="cursor-pointer">
                      <LayoutDashboard className="h-4 w-4 me-2 text-primary" />
                      <span>{t("nav.dashboard")}</span>
                    </Link>
                  </DropdownMenuItem>

                  {role === UserRole.USER && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/app/chats" className="cursor-pointer">
                          <MessageSquare className="h-4 w-4 me-2 text-primary" />
                          <span>{t("nav.messages")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/app/settings" className="cursor-pointer">
                          <Settings className="h-4 w-4 me-2 text-primary" />
                          <span>{t("nav.settings")}</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  {role === UserRole.SERVICE_PROVIDER && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link to="/provider/chats" className="cursor-pointer">
                          <MessageSquare className="h-4 w-4 me-2 text-primary" />
                          <span>{t("nav.messages")}</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/provider/profile" className="cursor-pointer">
                          <User className="h-4 w-4 me-2 text-primary" />
                          <span>{t("nav.myProfile")}</span>
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
                    <span>{t("nav.logOut")}</span>
                  </DropdownMenuItem>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="font-medium">
                <Link to="/login">{t("nav.signIn")}</Link>
              </Button>
              <Button size="sm" asChild className="font-medium shadow-xs">
                <Link to="/register">{t("nav.getStarted")}</Link>
              </Button>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
