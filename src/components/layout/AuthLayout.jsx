import { Outlet, Link } from "react-router-dom";
import { ShieldCheck, Clock, CheckCircle2, ArrowLeft, Star, Users } from "lucide-react";
import ThemeToggle from "@/components/shared/ThemeToggle";

export default function AuthLayout() {
  return (
    <div className="min-h-screen w-full flex flex-col lg:flex-row bg-background">
      {/* Brand Hero Panel (Desktop) */}
      <div className="relative hidden lg:flex lg:w-5/12 xl:w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-teal-950 via-teal-900 to-slate-950 p-12 text-white">
        {/* Ambient background glows */}
        <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-teal-500/20 blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 -right-24 h-96 w-96 rounded-full bg-emerald-500/15 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 left-1/3 h-80 w-80 rounded-full bg-teal-400/15 blur-3xl pointer-events-none" />

        {/* Brand Header */}
        <div className="relative z-10">
          <Link to="/" className="inline-flex items-center gap-3 group">
            <div className="h-11 w-11 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-400 flex items-center justify-center shadow-lg shadow-teal-500/25 group-hover:scale-105 transition-transform duration-300">
              <ShieldCheck className="h-6 w-6 text-teal-950 font-bold" />
            </div>
            <div>
              <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-teal-100 to-teal-300 bg-clip-text text-transparent">
                Alanis
              </span>
              <span className="block text-xs font-medium text-teal-300/80 tracking-widest uppercase">
                الأنـيـس • Marketplace
              </span>
            </div>
          </Link>
        </div>

        {/* Center Hero Content */}
        <div className="relative z-10 my-auto py-10 max-w-lg">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/10 border border-teal-500/20 text-teal-300 text-xs font-semibold mb-6">
            <span className="h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            Egypt's #1 Shift-Based Service Platform
          </div>

          <h2 className="text-3xl xl:text-4xl font-extrabold tracking-tight leading-tight text-white mb-4">
            Reliable hands for when you need them most.
          </h2>
          <p className="text-teal-100/70 text-base leading-relaxed mb-8">
            Connect with verified healthcare aides, childcare specialists, tutors,
            and home professionals booked per shift on your schedule.
          </p>

          {/* Value Prop Cards */}
          <div className="space-y-3.5">
            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.07]">
              <div className="p-2 rounded-lg bg-teal-500/20 text-teal-300 mt-0.5">
                <ShieldCheck className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Vetted & Background-Checked</h4>
                <p className="text-xs text-teal-200/60 mt-0.5">
                  National ID, criminal background, and professional credentials thoroughly audited.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.07]">
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 mt-0.5">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Shift-Based Transparency</h4>
                <p className="text-xs text-teal-200/60 mt-0.5">
                  Clear morning, evening, or night shift bookings with upfront, predictable pricing.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5 p-3.5 rounded-xl bg-white/[0.04] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.07]">
              <div className="p-2 rounded-lg bg-cyan-500/20 text-cyan-300 mt-0.5">
                <CheckCircle2 className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-white">Escrow Payment Protection</h4>
                <p className="text-xs text-teal-200/60 mt-0.5">
                  Payments are safely held and released only after the shift is satisfactorily fulfilled.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Metrics */}
        <div className="relative z-10 pt-6 border-t border-white/10 flex items-center justify-between text-xs text-teal-200/70">
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4 text-teal-400" />
            <span><strong className="text-white font-semibold">12,500+</strong> Shifts Booked</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-current" />
              ))}
            </div>
            <span><strong className="text-white font-semibold">4.9/5</strong> Client Trust</span>
          </div>
        </div>
      </div>

      {/* Main Form Area */}
      <div className="flex-1 flex flex-col justify-between p-4 sm:p-8 lg:p-12 overflow-y-auto bg-gradient-to-b from-background via-background to-muted/20">
        {/* Top bar */}
        <div className="flex items-center justify-between w-full max-w-2xl mx-auto mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Mobile brand header */}
            <div className="lg:hidden flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
                A
              </div>
              <span className="font-bold text-foreground">Alanis</span>
            </div>

            <ThemeToggle />
          </div>
        </div>

        {/* Form Container */}
        <div className="w-full max-w-2xl mx-auto my-auto py-2">
          <Outlet />
        </div>

        {/* Bottom copyright */}
        <div className="w-full max-w-2xl mx-auto mt-8 pt-4 border-t border-border/40 text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} Alanis (الأنـيـس). All rights reserved. Secure 256-bit encrypted authentication.
        </div>
      </div>
    </div>
  );
}
