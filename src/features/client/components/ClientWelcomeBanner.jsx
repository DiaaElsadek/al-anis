import {
  Search,
  FileText,
  MessageSquare,
  Mail,
  Phone,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import DirectionalIcon from "@/components/shared/DirectionalIcon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials, getMediaUrl } from "@/lib/utils";

export default function ClientWelcomeBanner({ user, profile }) {
  const { t, i18n } = useTranslation(["client", "common"]);
  const isArabic = i18n.language === "ar";

  const activeUser = profile || user;

  const displayName =
    activeUser?.fullName ||
    activeUser?.name ||
    (activeUser?.firstName && activeUser?.lastName
      ? `${activeUser.firstName} ${activeUser.lastName}`.trim()
      : activeUser?.firstName || activeUser?.email?.split("@")[0] || t("common:roles.client"));

  const email = activeUser?.email || "";
  const phone = activeUser?.phoneNumber || activeUser?.phone || "";
  const avatarUrl = activeUser?.profilePicture || activeUser?.profilePictureUrl;

  // Dynamic time greeting
  const hour = new Date().getHours();
  let timeGreeting = isArabic ? "مساء الخير،" : "Good evening,";
  if (hour >= 5 && hour < 12) {
    timeGreeting = isArabic ? "صباح الخير،" : "Good morning,";
  } else if (hour >= 12 && hour < 18) {
    timeGreeting = isArabic ? "مساء الخير،" : "Good afternoon,";
  }

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-xl border border-teal-500/20">
      {/* Decorative ambient glows */}
      <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 h-48 w-48 rounded-full bg-primary/10 blur-2xl pointer-events-none" />

      <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
        {/* Left: User Identity Info */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 max-w-2xl">
          <div className="relative group shrink-0">
            <Avatar className="h-20 w-20 sm:h-24 sm:w-24 rounded-2xl ring-4 ring-white/10 shadow-lg border border-teal-400/30">
              <AvatarImage
                src={getMediaUrl(avatarUrl)}
                alt={displayName}
                className="object-cover"
              />
              <AvatarFallback className="rounded-2xl bg-teal-800 text-teal-100 font-bold text-xl sm:text-2xl">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute -bottom-1 -end-1 h-5 w-5 rounded-full bg-emerald-500 border-2 border-slate-900 flex items-center justify-center">
              <CheckCircle2 className="h-3 w-3 text-white" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <Badge className="bg-teal-500/20 hover:bg-teal-500/30 text-teal-200 border border-teal-500/30 text-xs px-2.5 py-0.5 font-medium backdrop-blur-sm">
                <ShieldCheck className="h-3.5 w-3.5 me-1 text-teal-300" />
                {t("client:dashboard.clientAccount")}
              </Badge>
              {email && (
                <span className="inline-flex items-center gap-1 text-[11px] text-teal-200/80 bg-white/5 border border-white/10 px-2 py-0.5 rounded-full">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                  {t("client:dashboard.emailVerified")}
                </span>
              )}
            </div>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight">
                <span className="text-teal-200/90 font-medium text-xl sm:text-2xl block sm:inline sm:me-2">
                  {timeGreeting}
                </span>
                <span className="bg-gradient-to-r from-white via-teal-100 to-emerald-200 bg-clip-text text-transparent">
                  {displayName}
                </span>
              </h1>
              <p className="text-teal-100/75 text-xs sm:text-sm mt-1 max-w-xl leading-relaxed">
                {t("client:dashboard.welcomeSubtitle")}
              </p>
            </div>

            {/* Email & Phone Badges */}
            <div className="flex flex-wrap items-center gap-3 pt-1 text-xs text-teal-200/90">
              {email && (
                <span className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 transition-colors px-2.5 py-1 rounded-lg border border-white/10">
                  <Mail className="h-3.5 w-3.5 text-teal-300 shrink-0" />
                  <span className="font-mono text-[11px]">{email}</span>
                </span>
              )}
              {phone && (
                <span className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 transition-colors px-2.5 py-1 rounded-lg border border-white/10">
                  <Phone className="h-3.5 w-3.5 text-teal-300 shrink-0" />
                  <span className="font-mono text-[11px]" dir="ltr">
                    {phone}
                  </span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap lg:flex-col gap-2.5 w-full sm:w-auto shrink-0 pt-2 lg:pt-0">
          <Button
            asChild
            size="lg"
            className="w-full sm:w-auto h-11 px-5 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white font-semibold rounded-xl shadow-lg shadow-teal-900/40 border-0"
          >
            <Link to="/app/providers">
              <Search className="h-4 w-4 me-2" />
              <span>{t("client:dashboard.quickBook")}</span>
              <DirectionalIcon className="h-4 w-4 ms-2" />
            </Link>
          </Button>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-initial h-9 px-3.5 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs backdrop-blur-sm"
            >
              <Link to="/app/requests">
                <FileText className="h-3.5 w-3.5 me-1.5 text-teal-200" />
                <span>{t("client:dashboard.viewRequests")}</span>
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size="sm"
              className="flex-1 sm:flex-initial h-9 px-3.5 bg-white/10 hover:bg-white/20 text-white border-white/20 rounded-xl text-xs backdrop-blur-sm"
            >
              <Link to="/app/chats">
                <MessageSquare className="h-3.5 w-3.5 me-1.5 text-teal-200" />
                <span>{t("client:dashboard.chatWithCaregiver")}</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

ClientWelcomeBanner.propTypes = {
  user: PropTypes.object,
  profile: PropTypes.object,
};
