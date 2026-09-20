import { Moon, Sun, Sunset } from "lucide-react";

export function getShiftDetails(t) {
  return [
    {
      id: "morning",
      title: t("landing:shifts.items.morning.title"),
      time: t("landing:shifts.items.morning.time"),
      badge: t("landing:shifts.items.morning.badge"),
      icon: Sun,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      bestFor: t("landing:shifts.items.morning.bestFor"),
      included: t("landing:shifts.items.morning.included", { returnObjects: true }) || [],
      startingRate: 350,
    },
    {
      id: "evening",
      title: t("landing:shifts.items.evening.title"),
      time: t("landing:shifts.items.evening.time"),
      badge: t("landing:shifts.items.evening.badge"),
      icon: Sunset,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      bestFor: t("landing:shifts.items.evening.bestFor"),
      included: t("landing:shifts.items.evening.included", { returnObjects: true }) || [],
      startingRate: 350,
    },
    {
      id: "night",
      title: t("landing:shifts.items.night.title"),
      time: t("landing:shifts.items.night.time"),
      badge: t("landing:shifts.items.night.badge"),
      icon: Moon,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      bestFor: t("landing:shifts.items.night.bestFor"),
      included: t("landing:shifts.items.night.included", { returnObjects: true }) || [],
      startingRate: 400,
    },
  ];
}

export function getSpotlightProviders(t) {
  const spotlightData = t("landing:caregivers.spotlight", { returnObjects: true }) || [];
  const avatars = {
    "prov-1":
      "https://images.unsplash.com/photo-1594824813576-809d43501a30?w=200&auto=format&fit=crop&q=80",
    "prov-2":
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
    "prov-3":
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
  };
  const stats = {
    "prov-1": { rating: 5.0, reviewsCount: 148, shiftsCompleted: 310, rate: 450 },
    "prov-2": { rating: 4.9, reviewsCount: 112, shiftsCompleted: 245, rate: 400 },
    "prov-3": { rating: 4.95, reviewsCount: 96, shiftsCompleted: 180, rate: 350 },
  };

  return spotlightData.map((item) => ({
    ...item,
    avatar: avatars[item.id] || avatars["prov-1"],
    ...(stats[item.id] || stats["prov-1"]),
  }));
}

export function getComparisonRows(t) {
  const rows = t("landing:whyAlanis.rows", { returnObjects: true }) || [];
  return rows.map((row) => ({
    ...row,
    advantage: true,
  }));
}

export function getFaqs(t) {
  return t("landing:faq.items", { returnObjects: true }) || [];
}

export function getTestimonials(t) {
  const items = t("landing:testimonials.items", { returnObjects: true }) || [];
  return items.map((item) => ({
    ...item,
    rating: 5,
  }));
}
