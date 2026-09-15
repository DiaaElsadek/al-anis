import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import {
  ShieldCheck,
  Star,
  Clock,
  Users,
  Search,
  ArrowRight,
  Sun,
  Sunset,
  Moon,
  Lock,
  HeartHandshake,
  Award,
  ChevronRight,
} from "lucide-react";

import { getCategories } from "@/api/category";
import { getLocalizedCategoryName } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import DirectionalIcon from "@/components/shared/DirectionalIcon";

// Fallback categories if backend is still initializing
const FALLBACK_CATEGORIES = [
  {
    id: "cat-1",
    name: "تمريض منزلي ورعاية صحية",
    nameEn: "Home Nursing & Medical Care",
    icon: "🩺",
    description: "Certified nurses for post-op recovery, injections, and vitals monitoring.",
    descriptionAr: "ممرضون مؤهلون لمتابعة الحالات بعد العمليات، وإعطاء الحقن، ومتابعة المؤشرات الحيوية.",
  },
  {
    id: "cat-2",
    name: "رعاية كبار السن وجليسات",
    nameEn: "Elderly Care & Companionship",
    icon: "👵",
    description: "Compassionate aides assisting with mobility, companionship, and medication.",
    descriptionAr: "مساعدون رحماء للمساعدة في الحركة وتناول الأدوية والمرافقة اليومية باهتمام.",
  },
  {
    id: "cat-3",
    name: "رعاية وجليسات أطفال",
    nameEn: "Childcare & Babysitting",
    icon: "👶",
    description: "Vetted nannies and babysitters trained in child safety and developmental play.",
    descriptionAr: "جليسات مؤهلات تم التحقق منهن ومدربات على رعاية الأطفال والأنشطة التنموية.",
  },
  {
    id: "cat-4",
    name: "علاج طبيعي وتأهيل حركي",
    nameEn: "Physiotherapy & Rehab",
    icon: "🏃‍♂️",
    description: "Licensed therapists helping restore mobility, strength, and recovery at home.",
    descriptionAr: "أخصائيون معتمدون لاستعادة الحركة والقوة والتأهيل البدني في راحة منزلك.",
  },
  {
    id: "cat-5",
    name: "دروس وتأسيس أكاديمي",
    nameEn: "Private Tutoring & Foundations",
    icon: "📚",
    description: "Qualified educators providing focused one-on-one lessons for school students.",
    descriptionAr: "معلمون متخصصون لتقديم دروس تأسيسية وشروحات فردية مركزة للطلاب.",
  },
  {
    id: "cat-6",
    name: "تدبير ومساعد منزلي",
    nameEn: "Housekeeping & Domestic Aid",
    icon: "🧹",
    description: "Trustworthy domestic aides for deep organization, meal prep, and upkeep.",
    descriptionAr: "مساعدون منزليون موثوقون لتنظيم المنزل وإعداد الوجبات والتنظيف المتكامل.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["common", "auth", "client"]);
  const isArabic = i18n.language?.startsWith("ar");
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch real categories from backend
  const { data: categoriesData } = useQuery({
    queryKey: ["landing-categories"],
    queryFn: getCategories,
    staleTime: 5 * 60 * 1000,
  });

  const categories = categoriesData?.length ? categoriesData : FALLBACK_CATEGORIES;

  const SHIFT_CARDS = [
    {
      title: isArabic ? "وردية صباحية" : "Morning Shift",
      time: isArabic ? "8:00 ص – 4:00 م" : "8:00 AM – 4:00 PM",
      arabicBadge: isArabic ? "صباحية" : "Morning",
      icon: Sun,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      desc: isArabic
        ? "مثالية للرعاية النهارية لكبار السن، وجلسات العلاج الطبيعي بعد العمليات، والدروس، ومواعيد الأدوية الصباحية."
        : "Perfect for active daytime care, post-surgical physical therapy, tutoring, and morning medication routines.",
    },
    {
      title: isArabic ? "وردية مسائية" : "Evening Shift",
      time: isArabic ? "4:00 م – 12:00 ص" : "4:00 PM – 12:00 AM",
      arabicBadge: isArabic ? "مسائية" : "Evening",
      icon: Sunset,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      desc: isArabic
        ? "ممتازة للمساعدة بعد الدوام، ومرافقة كبار السن، وتحضير العشاء، ودعم العائلة في المساء."
        : "Ideal for after-school care, evening companion walks, dinner preparation, and family respite support.",
    },
    {
      title: isArabic ? "وردية ليلية" : "Night Shift",
      time: isArabic ? "12:00 ص – 8:00 ص" : "12:00 AM – 8:00 AM",
      arabicBadge: isArabic ? "ليلية" : "Night",
      icon: Moon,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      desc: isArabic
        ? "إشراف طبي وتمريضي متواصل طوال الليل، ومساعدة نوم الرضع، وضمان أعلى درجات الأمان والراحة."
        : "Overnight continuous medical supervision, infant sleep support, and non-stop safety assurance.",
    },
  ];

  const TESTIMONIALS = [
    {
      quote: isArabic
        ? "العثور على ممرض معتمد لورديات والدي الليلية كان أمراً مقلقاً حتى استخدمت منصة الأنيس. الاطمئنان أن الممرض تم تدقيقه جنائياً وأموالي في الضمان منحنا راحة بال حقيقية."
        : "Finding a trusted certified nurse for my father's night shifts was stressful until Alanis. Knowing the provider was background checked and payment held in escrow gave us true peace of mind.",
      author: isArabic ? "م. طارق منصور" : "Eng. Tarek Mansour",
      role: isArabic ? "عميل موثق • القاهرة الجديدة" : "Verified Client • New Cairo",
      rating: 5,
      category: isArabic ? "تمريض منزلي" : "Home Nursing",
    },
    {
      quote: isArabic
        ? "كممرضة أطفال معتمدة، تتيح لي منصة الأنيس جدولة وردياتي المتاحة لأسابيع مقدماً. ونظام الدفع الضامن يضمن استلام مستحقاتي فور إتمام الوردية بكل شفافية."
        : "As a certified pediatric nurse, Alanis allows me to publish my open shifts weeks in advance. The escrow guarantee ensures I receive my earnings immediately upon shift completion.",
      author: isArabic ? "أخصائية سلمى السيد" : "Nurse Salma El-Sayed",
      role: isArabic ? "مزودة خدمة موثقة • مصر الجديدة" : "Verified Provider • Heliopolis",
      rating: 5,
      category: isArabic ? "رعاية أطفال وتمريض" : "Childcare & Nursing",
    },
    {
      quote: isArabic
        ? "نظام الحجز بالوردية حل عبقري. بدلاً من حساب الساعات والمفاجآت، تعرف بالضبط الوردية المحجوزة والتكلفة الثابتة مسبقاً دون أي ارتباك."
        : "The shift-based booking model is brilliant. Instead of hourly clock-watching, you know exactly what shift you've reserved and what you're paying upfront.",
      author: isArabic ? "د. منى عبد الرحمن" : "Dr. Mona Abdel-Rahman",
      role: isArabic ? "عميلة موثقة • المعادي" : "Verified Client • Maadi",
      rating: 5,
      category: isArabic ? "رعاية كبار السن" : "Elderly Care",
    },
  ];

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/login?redirect=/app/providers&q=${encodeURIComponent(searchQuery)}`);
    } else {
      navigate("/register");
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Navigation Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/65 shadow-xs">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-primary via-primary/90 to-emerald-400 flex items-center justify-center text-primary-foreground shadow-sm shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                {t("common:brand.name")}
              </span>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider -mt-1 uppercase hidden sm:block">
                {t("common:brand.subtitle")}
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
            <a href="#shifts" className="hover:text-foreground transition-colors">
              {isArabic ? "مفهوم الورديات" : "Shift Concept"}
            </a>
            <a href="#categories" className="hover:text-foreground transition-colors">
              {isArabic ? "التخصصات" : "Categories"}
            </a>
            <a href="#how-it-works" className="hover:text-foreground transition-colors">
              {isArabic ? "كيف تعمل المنصة" : "How It Works"}
            </a>
            <a href="#trust" className="hover:text-foreground transition-colors">
              {isArabic ? "الأمان والضمان" : "Trust & Safety"}
            </a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">
              {isArabic ? "آراء العملاء" : "Reviews"}
            </a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSwitcher />
            <ThemeToggle />
            <Button variant="ghost" size="sm" asChild className="font-medium">
              <Link to="/login">{t("common:nav.signIn")}</Link>
            </Button>
            <Button size="sm" asChild className="font-medium shadow-xs">
              <Link to="/register">{t("common:nav.getStarted")}</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
          {/* Ambient Glow Orbs */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-primary/15 via-emerald-500/10 to-teal-400/5 blur-[120px] rounded-full pointer-events-none -z-10" />

          <div className="container max-w-5xl mx-auto text-center space-y-8">
            {/* Top Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold shadow-xs animate-in fade-in slide-in-from-bottom-3 duration-500">
              <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{isArabic ? "المنصة الأولى لحجز الورديات في مصر" : "Egypt's First Shift-Based Service Marketplace"}</span>
              <span className="text-muted-foreground">•</span>
              <span className="text-muted-foreground font-normal">{t("common:brand.subtitle")}</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground leading-[1.15] text-balance">
              {isArabic ? "رعاية وخدمات موثوقة، " : "Verified Care & Services, "}
              <span className="bg-gradient-to-r from-primary via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                {isArabic ? "محجوزة بنظام الوردية." : "Booked Per Shift."}
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
              {isArabic
                ? "تواصل مع ممرضين، ومرافقي كبار سن، وجليسات أطفال، ومدرسين معتمدين. أسعار ثابتة لكل وردية صباحية أو مسائية أو ليلية مع حماية كاملة للدفع الضامن."
                : "Connect with audited healthcare aides, elderly companions, babysitters, and private tutors. Transparent pricing per morning, evening, or night shift with 100% escrow payment protection."}
            </p>

            {/* Hero Search & CTA */}
            <div className="max-w-2xl mx-auto pt-2">
              <form
                onSubmit={handleHeroSearch}
                className="flex flex-col sm:flex-row items-center gap-2 p-2 rounded-2xl bg-card border border-border/80 shadow-lg shadow-primary/5 backdrop-blur-md"
              >
                <div className="relative flex-1 w-full">
                  <Search className="absolute start-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder={
                      isArabic
                        ? "ابحث بالتخصص (مثال: تمريض منزلي، رعاية مسنين، جليسة أطفال)..."
                        : "Search by specialty (e.g. Home Nurse, Elderly Aide, Tutoring)..."
                    }
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="ps-10 h-12 border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm"
                  />
                </div>
                <Button type="submit" size="lg" className="w-full sm:w-auto h-12 px-6 gap-2 font-semibold">
                  <span>{isArabic ? "ابحث عن مزود" : "Find Providers"}</span>
                  <DirectionalIcon icon={ArrowRight} className="h-4 w-4" />
                </Button>
              </form>

              <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-primary" />
                  {isArabic ? "تدقيق الرقم القومي" : "Verified National ID"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Lock className="h-3.5 w-3.5 text-emerald-500" />
                  {isArabic ? "حماية الدفع الضامن" : "Escrow Safe Payment"}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500" />
                  {isArabic ? "تقييم ثقة 4.9/5" : "4.9/5 Rating"}
                </span>
              </div>
            </div>

            {/* Platform Proof Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-10 border-t border-border/60">
              <div className="p-4 rounded-xl bg-card/60 border border-border/60 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">12,500+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isArabic ? "وردية منفذة بنجاح" : "Shifts Successfully Fulfilled"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card/60 border border-border/60 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">1,200+</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isArabic ? "مزود خدمة معتمد" : "Vetted Service Providers"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card/60 border border-border/60 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">4.9 / 5</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isArabic ? "متوسط تقييم العملاء" : "Average Client Trust Score"}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-card/60 border border-border/60 text-center">
                <p className="text-2xl sm:text-3xl font-extrabold text-foreground">100%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {isArabic ? "ضمان حماية المدفوعات" : "Escrow Protected Payouts"}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* The Shift Innovation Section */}
        <section id="shifts" className="py-20 bg-muted/40 border-y border-border/60">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "ميزة الأنيس" : "The Alanis Advantage"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "جدولة ورديات محددة وشفافة" : "Predictable Shift-Based Scheduling"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "وداعاً لعدّاد الساعات المفاجئ. في الأنيس تحجز ورديات محددة المدة بأسعار ثابتة ومعروفة مسبقاً لكل من العميل والمزود."
                  : "No surprises. Unlike unpredictable hourly meters, Alanis books fixed-duration shifts with upfront pricing so both clients and providers have complete clarity."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SHIFT_CARDS.map((shift, idx) => (
                <Card
                  key={idx}
                  className="relative overflow-hidden border border-border/80 shadow-xs hover:shadow-md transition-all group"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className={`w-12 h-12 rounded-xl ${shift.bg} ${shift.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                        <shift.icon className="h-6 w-6" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">
                        {shift.arabicBadge}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold text-foreground">{shift.title}</h3>
                      <p className="text-xs font-semibold text-primary mt-0.5">{shift.time}</p>
                    </div>

                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {shift.desc}
                    </p>

                    <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs text-muted-foreground">
                      <span>{isArabic ? "وردية ثابتة 8 ساعات" : "Fixed 8-hour shift"}</span>
                      <span className="font-semibold text-foreground">
                        {isArabic ? "خدمة مضمونة" : "Guaranteed Service"}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Featured Categories */}
        <section id="categories" className="py-20">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs text-primary border-primary/20">
                  {isArabic ? "التخصصات والخدمات" : "Services"}
                </Badge>
                <h2 className="text-3xl font-bold tracking-tight text-foreground">
                  {isArabic ? "مجالات الرعاية والخدمات المتخصصة" : "Care & Professional Specialties"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isArabic
                    ? "تصفح متخصصين مؤهلين تم فحصهم وتدقيق أوراقهم لخدمة عائلتك."
                    : "Browse audited professionals specialized in in-home assistance and family care."}
                </p>
              </div>

              <Button variant="outline" size="sm" asChild className="self-start sm:self-auto gap-1">
                <Link to="/register">
                  <span>{isArabic ? "جميع التخصصات" : "View All Specialties"}</span>
                  <DirectionalIcon icon={ChevronRight} className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const localizedName = getLocalizedCategoryName(cat, i18n.language);
                const desc = isArabic ? (cat.descriptionAr || cat.description) : (cat.description || cat.descriptionAr);

                return (
                  <Card
                    key={cat.id}
                    className="border border-border/80 shadow-xs hover:border-primary/40 hover:shadow-md transition-all cursor-pointer group"
                    onClick={() => navigate(`/login?redirect=/app/providers&cat=${cat.id}`)}
                  >
                    <CardContent className="p-6 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-3xl">{cat.icon || "🌟"}</span>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          {isArabic ? "معتمد وموثق" : "Audited"}
                        </Badge>
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-foreground group-hover:text-primary transition-colors">
                          {localizedName}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {isArabic ? cat.nameEn : cat.name}
                        </p>
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {desc || (isArabic ? "متخصصون معتمدون جاهزون لحجز الورديات وفق جدولك." : "Certified professionals ready for shift booking on your schedule.")}
                      </p>
                      <div className="pt-2 text-xs font-semibold text-primary flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        <span>{isArabic ? "استكشف المزودين" : "Explore Providers"}</span>
                        <DirectionalIcon icon={ArrowRight} className="h-3.5 w-3.5" />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-20 bg-muted/40 border-y border-border/60">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "بساطة وأمان" : "Simple & Transparent"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "كيف تعمل المنصة في 3 خطوات" : "How Alanis Works in 3 Steps"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "من اختيار المزود وحتى تنفيذ الوردية، نضمن لك حماية أموالك ووقتك."
                  : "From finding the right provider to shift fulfillment, we protect your time and funds."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="text-center space-y-4 p-6 rounded-2xl bg-card border border-border/80 shadow-xs relative">
                <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-primary/20">
                  1
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {isArabic ? "اختر الوردية والمزود" : "Choose Shift & Provider"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "تصفح ملفات المزودين المعتمدين، واطلع على جدول وردياتهم المتاحة وتقييمات العملاء، وأرسل طلبك."
                    : "Browse audited providers, check verified certificates, view their shift availability calendar, and submit your request."}
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-2xl bg-card border border-border/80 shadow-xs relative">
                <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-primary/20">
                  2
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {isArabic ? "سداد الدفع الضامن الآمن" : "Secure Escrow Payment"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "ادفع بأمان عبر بطاقتك. يحتفظ حساب الضمان بالأموال ولا يتم تسليمها للمزود إلا بعد إتمام الوردية برضاك."
                    : "Pay securely via card or wallet. Your money is safely held in platform escrow and is NOT released to the provider until service is completed."}
                </p>
              </div>

              <div className="text-center space-y-4 p-6 rounded-2xl bg-card border border-border/80 shadow-xs relative">
                <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-primary/20">
                  3
                </div>
                <h3 className="text-lg font-bold text-foreground">
                  {isArabic ? "تنفيذ الوردية والتقييم" : "Shift Fulfilled & Review"}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "نسق التفاصيل بسهولة عبر المحادثة الفورية. بعد اكتمال الوردية، أكد التنفيذ وانشر تقييمك لمساعدة الآخرين."
                    : "Coordinate in real-time via chat. Once the provider fulfills the shift, verify completion, release payment, and leave a verified review."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Trust & Safety Features */}
        <section id="trust" className="py-20">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "الأمان أولاً" : "Safety First"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "معايير تدقيق وأمان صارمة" : "Rigorous Trust & Safety Standards"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "نؤمن بأن منزلك وعائلتك يستحقان أعلى درجات التدقيق والاطمئنان."
                  : "We believe your family and home deserve nothing less than thorough verification."}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="p-6 rounded-xl bg-card border border-border/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">
                  {isArabic ? "بطاقة الرقم القومي" : "14-Digit National ID"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "يتم التحقق من بيانات كل مزود خدمة ومطابقتها مع السجلات الرسمية المصرية."
                    : "Every provider identity is verified against Egyptian official national registry records."}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                  <Award className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">
                  {isArabic ? "الشهادات والتراخيص" : "Certificates & CVs"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "مراجعة يدوية لتراخيص مزاولة المهنة والشهادات الطبية والأكاديمية."
                    : "Medical licenses, nursing certifications, and tutoring credentials manually reviewed by admins."}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                  <Lock className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">
                  {isArabic ? "ضمان الدفع الإلكتروني" : "Escrow Guarantee"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "أموالك في أمان تام ولا تُحول لمزود الخدمة إلا بعد اكتمال ورديته بنجاح."
                    : "No advance cash risks. Funds remain securely escrowed until the booked shift is completed."}
                </p>
              </div>

              <div className="p-6 rounded-xl bg-card border border-border/80 space-y-3">
                <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                  <HeartHandshake className="h-5 w-5" />
                </div>
                <h4 className="font-bold text-base text-foreground">
                  {isArabic ? "محادثة فورية مباشرة" : "Real-Time Chat"}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isArabic
                    ? "تواصل فوري آمن ومباشر بين العميل والمزود لتنسيق خطة الرعاية والوصول."
                    : "Instant secure messaging between client and provider for smooth coordination and instructions."}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section id="testimonials" className="py-20 bg-muted/40 border-t border-border/60">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "ثقة العائلات" : "Client Trust"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "تجارب حقيقية من عملائنا ومزودينا" : "Stories from Satisfied Clients & Aides"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "آراء موثقة من عائلات ومقدمي رعاية من مختلف محافظات مصر."
                  : "Real feedback from families and verified service providers across Egypt."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((tItem, idx) => (
                <Card key={idx} className="border border-border/80 shadow-xs">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex text-amber-400">
                      {[...Array(tItem.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-current" />
                      ))}
                    </div>
                    <p className="text-sm text-foreground/90 italic leading-relaxed">
                      "{tItem.quote}"
                    </p>
                    <div className="pt-2 border-t border-border/60">
                      <p className="font-bold text-sm text-foreground">{tItem.author}</p>
                      <p className="text-xs text-muted-foreground">{tItem.role}</p>
                      <Badge variant="secondary" className="mt-2 text-[10px]">
                        {tItem.category}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="py-20 relative overflow-hidden">
          <div className="container max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-teal-950 p-8 sm:p-14 text-center text-white overflow-hidden shadow-2xl">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <Badge className="bg-white/15 text-white border-white/20 text-xs">
                  {isArabic ? "انضم لأكبر شبكة رعاية موثوقة في مصر" : "Join Egypt's Most Trusted Care Community"}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {isArabic ? "جاهز لحجز ورديتك الأولى؟" : "Ready to book your first shift?"}
                </h2>
                <p className="text-white/80 text-base">
                  {isArabic
                    ? "سجل حسابك في دقائق. تصفح مزودين معتمدين، وحدد ورديتك، واستمتع برعاية كريمة ومضمونة."
                    : "Sign up in minutes. Browse verified providers, select your shift, and experience transparent, dignified care."}
                </p>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
                  <Button
                    size="lg"
                    asChild
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold shadow-lg"
                  >
                    <Link to="/register">{isArabic ? "سجل الآن مجاناً" : "Get Started Today"}</Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto border-white/30 text-white hover:bg-white/10"
                  >
                    <Link to="/login">{t("common:nav.signIn")}</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/80 bg-background py-12">
        <div className="container max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
              <ShieldCheck className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-foreground text-lg">{t("common:brand.name")}</span>
              <span className="text-xs text-muted-foreground block -mt-1">
                {t("common:brand.subtitle")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/login" className="hover:text-foreground transition-colors">
              {t("common:nav.signIn")}
            </Link>
            <Link to="/register" className="hover:text-foreground transition-colors">
              {t("common:nav.getStarted")}
            </Link>
            <a href="#shifts" className="hover:text-foreground transition-colors">
              {isArabic ? "الورديات" : "Shifts"}
            </a>
            <a href="#categories" className="hover:text-foreground transition-colors">
              {isArabic ? "التخصصات" : "Categories"}
            </a>
          </div>

          <div className="flex items-center gap-3">
            <LanguageSwitcher compact />
            <ThemeToggle compact />
            <span className="text-xs text-muted-foreground">
              {t("common:footer.copyright", { year: new Date().getFullYear() })}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
