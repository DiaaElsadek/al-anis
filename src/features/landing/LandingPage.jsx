import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { getCategories } from "@/api/category";
import CaregiversSection from "@/features/landing/components/CaregiversSection";
import CategoriesSection from "@/features/landing/components/CategoriesSection";
import CTASection from "@/features/landing/components/CTASection";
import FAQSection from "@/features/landing/components/FAQSection";
import HeroSection from "@/features/landing/components/HeroSection";
import HowItWorksSection from "@/features/landing/components/HowItWorksSection";
import LandingFooter from "@/features/landing/components/LandingFooter";
import LandingNav from "@/features/landing/components/LandingNav";
import ShiftsSection from "@/features/landing/components/ShiftsSection";
import TestimonialsSection from "@/features/landing/components/TestimonialsSection";
import WhyAlanisSection from "@/features/landing/components/WhyAlanisSection";
import { FALLBACK_CATEGORIES } from "@/lib/constants";

export default function LandingPage() {
  const navigate = useNavigate();
  const { i18n } = useTranslation(["common", "auth", "client"]);
  const isArabic = i18n.language?.startsWith("ar");

  // Search Console State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [locationQuery, setLocationQuery] = useState("");
  const [searchQuery] = useState("");

  // Fetch real categories from backend
  const { data: categoriesData } = useQuery({
    queryKey: ["landing-categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData?.length ? categoriesData : FALLBACK_CATEGORIES;

  const handleConsoleSearch = (e) => {
    e?.preventDefault();
    const params = new URLSearchParams();
    if (selectedCategory && selectedCategory !== "all") params.set("cat", selectedCategory);
    if (selectedShift && selectedShift !== "all") params.set("shift", selectedShift);
    if (locationQuery) params.set("area", locationQuery);
    if (searchQuery) params.set("q", searchQuery);

    navigate(`/login?redirect=/app/providers&${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      <LandingNav isArabic={isArabic} />
      <main className="flex-1">
        <HeroSection
          isArabic={isArabic}
          categories={categories}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedShift={selectedShift}
          setSelectedShift={setSelectedShift}
          locationQuery={locationQuery}
          setLocationQuery={setLocationQuery}
          handleConsoleSearch={handleConsoleSearch}
        />
        <ShiftsSection isArabic={isArabic} />
        <CategoriesSection isArabic={isArabic} categories={categories} />
        <WhyAlanisSection isArabic={isArabic} />
        <HowItWorksSection isArabic={isArabic} />
        <CaregiversSection isArabic={isArabic} />
        <TestimonialsSection isArabic={isArabic} />
        <FAQSection isArabic={isArabic} />
        <CTASection isArabic={isArabic} />
      </main>
      <LandingFooter isArabic={isArabic} />
    </div>
  );
}
