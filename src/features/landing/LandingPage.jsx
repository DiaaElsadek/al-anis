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
  CheckCircle2,
  Calendar,
  DollarSign,
  MapPin,
  Sparkles,
  PhoneCall,
  FileCheck,
  Check,
  X,
  HelpCircle,
  Activity,
  BadgeCheck,
  ThumbsUp,
  CreditCard,
  Building2,
  Stethoscope,
  GraduationCap,
  Baby,
  UserCheck,
  Zap,
  Menu,
} from "lucide-react";

import { getCategories } from "@/api/category";
import { getLocalizedCategoryName, formatPrice, getInitials } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import ThemeToggle from "@/components/shared/ThemeToggle";
import LanguageSwitcher from "@/components/shared/LanguageSwitcher";
import DirectionalIcon from "@/components/shared/DirectionalIcon";
import CategoryIcon from "@/components/shared/CategoryIcon";

// Fallback categories if backend is still initializing
const FALLBACK_CATEGORIES = [
  {
    id: "cat-1",
    name: "تمريض منزلي ورعاية صحية",
    nameEn: "Home Nursing & Medical Care",
    icon: "Stethoscope",
    providersCount: 340,
    startingPrice: 400,
    description: "Certified nurses for post-op recovery, injections, and vitals monitoring.",
    descriptionAr: "ممرضون مؤهلون لمتابعة الحالات بعد العمليات، وإعطاء الحقن، ومتابعة المؤشرات الحيوية.",
  },
  {
    id: "cat-2",
    name: "رعاية كبار السن وجليسات",
    nameEn: "Elderly Care & Companionship",
    icon: "HeartHandshake",
    providersCount: 280,
    startingPrice: 350,
    description: "Compassionate aides assisting with mobility, companionship, and medication.",
    descriptionAr: "مساعدون رحماء للمساعدة في الحركة وتناول الأدوية والمرافقة اليومية باهتمام.",
  },
  {
    id: "cat-3",
    name: "رعاية وجليسات أطفال",
    nameEn: "Childcare & Babysitting",
    icon: "Baby",
    providersCount: 210,
    startingPrice: 300,
    description: "Vetted nannies and babysitters trained in child safety and developmental play.",
    descriptionAr: "جليسات مؤهلات تم التحقق منهن ومدربات على رعاية الأطفال والأنشطة التنموية.",
  },
  {
    id: "cat-4",
    name: "علاج طبيعي وتأهيل حركي",
    nameEn: "Physiotherapy & Rehab",
    icon: "Activity",
    providersCount: 160,
    startingPrice: 450,
    description: "Licensed therapists helping restore mobility, strength, and recovery at home.",
    descriptionAr: "أخصائيون معتمدون لاستعادة الحركة والقوة والتأهيل البدني في راحة منزلك.",
  },
  {
    id: "cat-5",
    name: "دروس وتأسيس أكاديمي",
    nameEn: "Private Tutoring & Foundations",
    icon: "GraduationCap",
    providersCount: 190,
    startingPrice: 250,
    description: "Qualified educators providing focused one-on-one lessons for school students.",
    descriptionAr: "معلمون متخصصون لتقديم دروس تأسيسية وشروحات فردية مركزة للطلاب.",
  },
  {
    id: "cat-6",
    name: "تدبير ومساعد منزلي",
    nameEn: "Housekeeping & Domestic Aid",
    icon: "Sparkles",
    providersCount: 150,
    startingPrice: 250,
    description: "Trustworthy domestic aides for deep organization, meal prep, and upkeep.",
    descriptionAr: "مساعدون منزليون موثوقون لتنظيم المنزل وإعداد الوجبات والتنظيف المتكامل.",
  },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation(["common", "auth", "client"]);
  const isArabic = i18n.language?.startsWith("ar");

  // Search Console State
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [locationQuery, setLocationQuery] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

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

  // Shift system deep-dive data
  const SHIFT_DETAILS = [
    {
      id: "morning",
      title: isArabic ? "وردية صباحية" : "Morning Shift",
      time: isArabic ? "8:00 ص – 4:00 م (8 ساعات)" : "8:00 AM – 4:00 PM (8 Hours)",
      badge: isArabic ? "نشاط نهاري" : "Daytime Routine",
      icon: Sun,
      color: "text-amber-500",
      bg: "bg-amber-500/10",
      border: "border-amber-500/20",
      bestFor: isArabic
        ? "متابعة ما بعد العمليات الجراحية، وإعطاء الحقن ومواعيد الأدوية الصباحية، وتأهيل كبار السن البدني، ورعاية الأطفال النهارية."
        : "Post-op surgical follow-ups, vital signs monitoring, morning medication schedules, physical rehab, and daytime childcare.",
      included: isArabic
        ? [
            "قياس السكر والضغط والعلامات الحيوية",
            "المساعدة في الاستحمام والحركة الصباحية",
            "إعداد الوجبات الغذائية المحددة طبياً",
            "تحديث خطة الرعاية والتنسيق المباشر مع الأسرة",
          ]
        : [
            "Vitals & blood glucose level monitoring",
            "Assisted morning hygiene and mobility exercises",
            "Medically tailored breakfast & lunch prep",
            "Live status updates in family chat thread",
          ],
      startingRate: 350,
    },
    {
      id: "evening",
      title: isArabic ? "وردية مسائية" : "Evening Shift",
      time: isArabic ? "4:00 م – 12:00 ص (8 ساعات)" : "4:00 PM – 12:00 AM (8 Hours)",
      badge: isArabic ? "مرافقة ودعم" : "Family Respite",
      icon: Sunset,
      color: "text-orange-500",
      bg: "bg-orange-500/10",
      border: "border-orange-500/20",
      bestFor: isArabic
        ? "مرافقة كبار السن، وتحضير وجبة العشاء، ودعم الأطفال في المذاكرة، ومساعدة الأسرة في فترات الراحة بعد عناء العمل."
        : "Elderly companionship, evening dinner assistance, after-school homework supervision, and family evening respite.",
      included: isArabic
        ? [
            "تنظيم ومتابعة جرعات أدوية المساء",
            "المرافقة والتحدث والمشي الخفيف في المنزل",
            "المساعدة في العناية الشخصية قبل النوم",
            "تسجيل الملاحظات اليومية ومشاركتها مع الطبيب أو الأسرة",
          ]
        : [
            "Evening medication intake supervision",
            "Companionship, mental stimulation, and indoor walks",
            "Preparation for bed & nighttime routine assistance",
            "Comprehensive daily log shared with family",
          ],
      startingRate: 350,
    },
    {
      id: "night",
      title: isArabic ? "وردية ليلية" : "Night Shift",
      time: isArabic ? "12:00 ص – 8:00 ص (8 ساعات)" : "12:00 AM – 8:00 AM (8 Hours)",
      badge: isArabic ? "إشراف دقيق" : "Overnight Safety",
      icon: Moon,
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
      bestFor: isArabic
        ? "مراقبة الحالات الحرجة والمقعدة طوال الليل، وتقليب المرضى لمنع قرح الفراش، ورعاية الرضع وحديثي الولادة لنوم هادئ للأم."
        : "Continuous overnight vital monitoring, bed-sore prevention turning, dementia safety, and infant nighttime soothing.",
      included: isArabic
        ? [
            "يقظة تامة ومراقبة مستمرة للمريض طوال ساعات الليل",
            "تقليب المرضى كل ساعتين وفق الإرشادات الطبية",
            "التدخل السريع عند أي طارئ والاتصال بالأسرة فوراً",
            "إعطاء الأدوية الليلية وتأمين نوم هادئ وكريم",
          ]
        : [
            "100% alert continuous monitoring through the night",
            "Repositioning every 2 hours to prevent pressure ulcers",
            "Emergency protocol readiness & instant family alert",
            "Nighttime medication & infant feeding assistance",
          ],
      startingRate: 400,
    },
  ];

  // Top Verified Caregiver Profiles Showcase
  const SPOTLIGHT_PROVIDERS = [
    {
      id: "prov-1",
      name: isArabic ? "أخصائية مريم سمير" : "Nurse Mariam Samir, RN",
      title: isArabic ? "أخصائية تمريض منزلي ورعاية حرجة" : "Home Healthcare & ICU Specialist",
      specialty: isArabic ? "تمريض منزلي" : "Home Nursing",
      avatar: "https://images.unsplash.com/photo-1594824813576-809d43501a30?w=200&auto=format&fit=crop&q=80",
      rating: 5.0,
      reviewsCount: 148,
      shiftsCompleted: 310,
      rate: 450,
      badge: isArabic ? "بكالوريوس تمريض • جامعة القاهرة" : "B.Sc. Nursing • Cairo Univ.",
      location: isArabic ? "القاهرة الجديدة • التجمع" : "New Cairo • Tagamoa",
      shiftsAvailable: isArabic ? "صباحية • مسائية" : "Morning • Evening",
    },
    {
      id: "prov-2",
      name: isArabic ? "أ. يوسف عبد العزيز" : "Youssef Abdelaziz, PT",
      title: isArabic ? "أخصائي تأهيل حركي وعلاج طبيعي" : "Rehab & Elderly Mobility Therapist",
      specialty: isArabic ? "علاج طبيعي ومرافقة" : "Physiotherapy & Mobility",
      avatar: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
      rating: 4.9,
      reviewsCount: 112,
      shiftsCompleted: 245,
      rate: 400,
      badge: isArabic ? "أخصائي معتمد • نقابة العلاج الطبيعي" : "Licensed Physical Therapist",
      location: isArabic ? "المعادي • حلوان" : "Maadi • Helwan",
      shiftsAvailable: isArabic ? "صباحية • ليلية" : "Morning • Night",
    },
    {
      id: "prov-3",
      name: isArabic ? "أ. هدى الشافعي" : "Hoda El-Shafei",
      title: isArabic ? "أخصائية رعاية أطفال وتعديل سلوك" : "Pediatric & Newborn Certified Aide",
      specialty: isArabic ? "رعاية أطفال وحديثي ولادة" : "Childcare & Newborn",
      avatar: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      rating: 4.95,
      reviewsCount: 96,
      shiftsCompleted: 180,
      rate: 350,
      badge: isArabic ? "دبلوم رياض أطفال • إسعافات أولية" : "Early Childhood • Pediatric CPR",
      location: isArabic ? "مصر الجديدة • مدينة نصر" : "Heliopolis • Nasr City",
      shiftsAvailable: isArabic ? "مسائية • ليلية" : "Evening • Night",
    },
  ];

  // Comparison Matrix
  const COMPARISON_ROWS = [
    {
      feature: isArabic ? "آلية التسعير والتكلفة" : "Pricing Model",
      alanis: isArabic ? "سعر ثابت محدد لكل وردية 8 ساعات دون مفاجآت" : "Fixed price per 8-hr shift with no hidden costs",
      traditional: isArabic ? "عدّاد ساعات مفتوح مع رسوم إضافية غير متوقعة" : "Unpredictable hourly meter with sudden overtime",
      advantage: true,
    },
    {
      feature: isArabic ? "أمان المدفوعات وضمان الأموال" : "Payment Protection",
      alanis: isArabic ? "دفع ضامن إلكتروني 100%؛ لا يُسلّم المال إلا بعد الرضا" : "100% digital escrow; released only after shift satisfaction",
      traditional: isArabic ? "دفع نقدي مسبق دون ضمان أو حق استرداد قانوني" : "Cash upfront without receipts or legal guarantees",
      advantage: true,
    },
    {
      feature: isArabic ? "تدقيق الأوراق والهوية الجنائية" : "Identity & Vetting",
      alanis: isArabic ? "فحص الرقم القومي، والفيش الجنائي، والشهادات الطبية" : "14-digit National ID verification, criminal check, licenses",
      traditional: isArabic ? "معارف وتوصيات شفهية دون سجلات موثقة رسمياً" : "Informal word-of-mouth without background check",
      advantage: true,
    },
    {
      feature: isArabic ? "التنسيق والتواصل المباشر" : "Direct Coordination",
      alanis: isArabic ? "محادثة فورية آمنة مع المزود قبل وأثناء الوردية" : "Instant secure in-app chat with the verified caregiver",
      traditional: isArabic ? "وسطاء ومكاتب سمسرة تأخذ عمولات وتعطل التواصل" : "Middleman brokers taking cuts and delaying requests",
      advantage: true,
    },
    {
      feature: isArabic ? "إمكانية الاستبدال والتعويض" : "Replacement Guarantee",
      alanis: isArabic ? "استرداد فوري أو حجز مزود بديل معتمد فوراً" : "Instant 100% escrow refund or instant replacement",
      traditional: isArabic ? "مماطلة من المكاتب وفقدان العربون المدفوع" : "Lost deposits and unfulfilled replacement promises",
      advantage: true,
    },
  ];

  // FAQ Items
  const FAQS = [
    {
      q: isArabic
        ? "كيف يعمل نظام الدفع الضامن (Escrow) في الأنيس؟"
        : "How does the Alanis Escrow Payment Guarantee work?",
      a: isArabic
        ? "عندما تحجز وردية، تقوم بسداد التكلفة عبر بطاقتك الائتمانية أو المحفظة الإلكترونية بأمان. لا يتم تحويل الأموال إلى حساب مزود الخدمة مباشرة، بل تظل محفوظة في حساب ضمان المنصة. فقط بعد انتهاء الوردية وتأكيدك لإتمامها بنجاح ورضاك التام، يتم تحويل المستحقات للمزود."
        : "When you book a shift, you pay via card or digital wallet. Your payment is held securely in platform escrow and is NOT sent directly to the provider. Funds are only released to the caregiver after the shift has been successfully fulfilled and you confirm satisfaction.",
    },
    {
      q: isArabic
        ? "كيف يتم فحص وتدقيق بيانات مزودي الخدمة والممرضين؟"
        : "How are nurses and service providers vetted before approval?",
      a: isArabic
        ? "يخضع كل متقدم لعملية تدقيق شاملة من فريق الامتثال، تشمل: التحقق من بطاقة الرقم القومي المصرية المكونة من 14 رقماً، ومراجعة تراخيص مزاولة المهنة الصادرة من وزارة الصحة والنقابات المهنية، وفحص السيرة الذاتية وشهادات الخبرة قبل تفعيل حسابه على المنصة."
        : "Every applicant undergoes rigorous multi-step auditing: official 14-digit National ID validation, verification of professional medical/nursing licenses from Egyptian medical syndicates, criminal record confirmation, and manual resume inspection by our compliance team.",
    },
    {
      q: isArabic
        ? "ماذا يحدث إذا اعتذر مزود الخدمة أو لم يحضر الوردية؟"
        : "What happens if a caregiver cancels or fails to arrive?",
      a: isArabic
        ? "حمايتك مضمونة بنسبة 100%. في حال اعتذار المزود أو عدم حضوره، يتيح لك النظام اختيار مزود بديل معتمد فوراً لنفس الوردية بنقرة واحدة، أو استرداد كامل المبلغ المحجوز في حساب الضمان فوراً إلى وسيلة دفعك دون أي خصم."
        : "You are 100% protected. If a provider cancels or cannot attend, our platform instantly lets you assign another verified caregiver for the shift with one click, or receive an immediate 100% refund of your escrowed funds back to your payment method.",
    },
    {
      q: isArabic
        ? "ما هي مواعيد الورديات الثابتة وهل يمكن حجز أيام متتالية؟"
        : "What are the fixed shift hours, and can I book consecutive days?",
      a: isArabic
        ? "تنقسم الورديات إلى 3 فترات قياسية (8 ساعات لكل وردية): الصباحية (8 ص – 4 م)، المسائية (4 م – 12 ص)، والليلية (12 ص – 8 ص). يمكنك حجز وردية واحدة أو عدة ورديات متتالية لعدة أيام أو أسابيع مقدماً حسب جدول المريض."
        : "Shifts are structured into 3 standardized 8-hour blocks: Morning (8:00 AM – 4:00 PM), Evening (4:00 PM – 12:00 AM), and Night (12:00 AM – 8:00 AM). You can book single shifts or reserve consecutive shifts across multiple days or weeks in advance.",
    },
    {
      q: isArabic
        ? "كيف يمكنني الانضمام كأخصائي تمريض أو مقدم رعاية على الأنيس؟"
        : "How can qualified healthcare professionals join Alanis as providers?",
      a: isArabic
        ? "يمكنك التسجيل بسهولة عبر صفحة 'تسجيل مزود خدمة'، ورفع صورة الرقم القومي والشهادات والتراخيص المهنية. بعد مراجعة أوراقك واعتمادها من الإدارة، ستتمكن من تحديد وردياتك المتاحة، واستقبال طلبات الحجز المباشرة من العائلات مع ضمان استلام أرباحك فوراً."
        : "You can apply via the 'Register as Provider' page by uploading your National ID and credentials. Once vetted and approved by our compliance desk, you can set your open shift calendar and accept booking requests with guaranteed instant payouts.",
    },
  ];

  // Testimonials
  const TESTIMONIALS = [
    {
      quote: isArabic
        ? "العثور على ممرض معتمد لورديات والدي الليلية كان أمراً مقلقاً حتى استخدمت منصة الأنيس. الاطمئنان أن الممرض تم تدقيقه جنائياً وأموالي في الضمان منحنا راحة بال حقيقية."
        : "Finding a trusted certified nurse for my father's night shifts was stressful until Alanis. Knowing the provider was background checked and payment held in escrow gave us true peace of mind.",
      author: isArabic ? "م. طارق منصور" : "Eng. Tarek Mansour",
      role: isArabic ? "عميل موثق • القاهرة الجديدة" : "Verified Client • New Cairo",
      rating: 5,
      category: isArabic ? "تمريض منزلي ورعاية حرجة" : "Home ICU Nursing",
    },
    {
      quote: isArabic
        ? "كممرضة أطفال معتمدة، تتيح لي منصة الأنيس جدولة وردياتي المتاحة لأسابيع مقدماً. ونظام الدفع الضامن يضمن استلام مستحقاتي فور إتمام الوردية بكل شفافية واحترام لجهدي."
        : "As a certified pediatric nurse, Alanis allows me to publish my open shifts weeks in advance. The escrow guarantee ensures I receive my earnings immediately upon shift completion.",
      author: isArabic ? "أخصائية سلمى السيد" : "Nurse Salma El-Sayed",
      role: isArabic ? "مزودة خدمة موثقة • مصر الجديدة" : "Verified Provider • Heliopolis",
      rating: 5,
      category: isArabic ? "رعاية أطفال وتمريض" : "Childcare & Nursing",
    },
    {
      quote: isArabic
        ? "نظام الحجز بالوردية حل عبقري. بدلاً من حساب الساعات والمفاجآت، تعرف بالضبط الوردية المحجوزة والتكلفة الثابتة مسبقاً دون أي ارتباك أو مساومة."
        : "The shift-based booking model is brilliant. Instead of hourly clock-watching, you know exactly what shift you've reserved and what you're paying upfront.",
      author: isArabic ? "د. منى عبد الرحمن" : "Dr. Mona Abdel-Rahman",
      role: isArabic ? "عميلة موثقة • المعادي" : "Verified Client • Maadi",
      rating: 5,
      category: isArabic ? "رعاية كبار السن" : "Elderly Care",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-primary/20 selection:text-primary">
      {/* Top Value Assurance Ribbon */}
      <div className="bg-muted/80 border-b border-border/60 py-1.5 px-4 text-[11px] font-medium text-muted-foreground">
        <div className="container max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 font-semibold">
              <ShieldCheck className="h-3.5 w-3.5" />
              {isArabic ? "حماية الضمان 100%" : "100% Escrow Protected"}
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">
              {isArabic ? "فحص جنائي ورقم قومي معتمد لكافة المزودين" : "Criminal & National ID Vetted Providers"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <PhoneCall className="h-3 w-3 text-primary" />
              <span className="font-mono">19824</span>
              <span className="hidden md:inline">({isArabic ? "دعم على مدار الساعة" : "24/7 Helpline"})</span>
            </span>
          </div>
        </div>
      </div>

      {/* Main Sticky Glassmorphic Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border/70 bg-background/85 backdrop-blur-md shadow-xs">
        <div className="container max-w-6xl mx-auto flex h-16 items-center justify-between gap-4">
          {/* Logo & Brand Identity */}
          <Link to="/" className="flex items-center gap-2.5 group shrink-0">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-primary via-teal-600 to-emerald-400 flex items-center justify-center text-primary-foreground shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
              <ShieldCheck className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent">
                  {t("common:brand.name")}
                </span>
                <Badge variant="outline" className="text-[10px] px-1.5 py-0 h-4 font-normal text-primary border-primary/20">
                  {isArabic ? "منصة مصرية" : "Egypt"}
                </Badge>
              </div>
              <span className="text-[10px] font-medium text-muted-foreground tracking-wider -mt-0.5 uppercase hidden sm:block">
                {t("common:brand.subtitle")}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-semibold text-muted-foreground">
            <a href="#shifts" className="hover:text-primary transition-colors">
              {isArabic ? "نظام الورديات" : "Shift System"}
            </a>
            <a href="#categories" className="hover:text-primary transition-colors">
              {isArabic ? "التخصصات" : "Specialties"}
            </a>
            <a href="#why-alanis" className="hover:text-primary transition-colors">
              {isArabic ? "لماذا الأنيس" : "Why Alanis"}
            </a>
            <a href="#how-it-works" className="hover:text-primary transition-colors">
              {isArabic ? "كيف تعمل" : "How It Works"}
            </a>
            <a href="#caregivers" className="hover:text-primary transition-colors">
              {isArabic ? "أطقم الرعاية" : "Caregivers"}
            </a>
            <a href="#faq" className="hover:text-primary transition-colors">
              {isArabic ? "الأسئلة الشائعة" : "FAQ"}
            </a>
          </nav>

          {/* Action Cluster */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <LanguageSwitcher />
            <ThemeToggle />

            <div className="hidden sm:flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild className="text-xs font-medium h-9">
                <Link to="/login">{t("common:nav.signIn")}</Link>
              </Button>
              <Button size="sm" asChild className="text-xs font-semibold h-9 shadow-sm shadow-primary/20">
                <Link to="/register">{t("common:nav.getStarted")}</Link>
              </Button>
            </div>

            {/* Mobile Navigation Sheet */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden h-9 w-9">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side={isArabic ? "right" : "left"} className="w-80 p-6 flex flex-col justify-between">
                <div className="space-y-6">
                  <SheetHeader>
                    <SheetTitle className="text-start flex items-center gap-2">
                      <div className="h-8 w-8 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                        <ShieldCheck className="h-5 w-5 text-white" />
                      </div>
                      <span className="font-bold text-lg">{t("common:brand.name")}</span>
                    </SheetTitle>
                  </SheetHeader>

                  <nav className="flex flex-col gap-3 text-sm font-medium text-muted-foreground pt-4">
                    <a href="#shifts" className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground">
                      {isArabic ? "نظام الورديات" : "Shift System"}
                    </a>
                    <a href="#categories" className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground">
                      {isArabic ? "التخصصات الخدمية" : "Specialties"}
                    </a>
                    <a href="#why-alanis" className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground">
                      {isArabic ? "لماذا الأنيس" : "Why Alanis"}
                    </a>
                    <a href="#how-it-works" className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground">
                      {isArabic ? "كيف تعمل المنصة" : "How It Works"}
                    </a>
                    <a href="#caregivers" className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground">
                      {isArabic ? "أطقم الرعاية المعتمدة" : "Caregivers"}
                    </a>
                    <a href="#faq" className="p-2 rounded-lg hover:bg-muted/50 hover:text-foreground">
                      {isArabic ? "الأسئلة الشائعة" : "FAQ"}
                    </a>
                  </nav>
                </div>

                <div className="space-y-2 pt-6 border-t border-border">
                  <Button asChild className="w-full">
                    <Link to="/register">{t("common:nav.getStarted")}</Link>
                  </Button>
                  <Button variant="outline" asChild className="w-full">
                    <Link to="/login">{t("common:nav.signIn")}</Link>
                  </Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-16 md:pb-28">
          {/* Ambient Lighting Mesh */}
          <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[720px] h-[400px] bg-gradient-to-tr from-primary/20 via-teal-500/10 to-emerald-400/5 blur-[140px] rounded-full pointer-events-none -z-10" />

          <div className="container max-w-6xl mx-auto space-y-10">
            {/* Top Eyebrow Pill */}
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/25 text-primary text-xs font-semibold shadow-xs">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                <span>{isArabic ? "المنصة الأولى المعتمدة لحجز الورديات في مصر" : "Egypt's #1 Verified Shift-Based Marketplace"}</span>
                <span className="text-muted-foreground/60">•</span>
                <span className="text-muted-foreground font-normal">{isArabic ? "حماية كاملة بالدفع الضامن" : "100% Escrow Protected"}</span>
              </div>
            </div>

            {/* Headline & Subhead */}
            <div className="text-center max-w-4xl mx-auto space-y-5">
              <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-foreground leading-[1.12] text-balance">
                {isArabic ? "رعاية وتمريض منزلي موثوق، " : "Verified Care & Healthcare Aides, "}
                <span className="bg-gradient-to-r from-primary via-teal-500 to-emerald-400 bg-clip-text text-transparent">
                  {isArabic ? "محجوز بنظام الوردية." : "Booked by Shift."}
                </span>
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed text-balance">
                {isArabic
                  ? "تواصل مع ممرضين، وجليسات مسنين وأطفال، وأخصائيي علاج طبيعي معتمدين برقم قومي مدقق. أسعار ثابتة لكل وردية 8 ساعات دون مفاجآت مع حماية كاملة لأموالك بالدفع الضامن."
                  : "Connect with certified nurses, elderly companions, babysitters, and rehab therapists. Fixed 8-hour shift rates, zero hidden overtime, and 100% digital escrow safety."}
              </p>
            </div>

            {/* Interactive Shift Explorer & Booking Console */}
            <div className="max-w-4xl mx-auto">
              <Card className="border border-border/80 shadow-xl shadow-primary/5 bg-card/95 backdrop-blur-md rounded-3xl p-3 sm:p-5">
                <form onSubmit={handleConsoleSearch} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Category Select */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        {isArabic ? "التخصص المطلوب" : "Specialty"}
                      </label>
                      <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                        <SelectTrigger className="h-11 rounded-xl text-xs bg-background">
                          <SelectValue placeholder={isArabic ? "اختر التخصص..." : "Select specialty..."} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isArabic ? "جميع التخصصات" : "All Specialties"}</SelectItem>
                          {categories.map((cat) => (
                            <SelectItem key={cat.id} value={cat.id}>
                              <div className="flex items-center gap-2">
                                <CategoryIcon icon={cat.icon} name={cat.name} className="h-3.5 w-3.5 text-primary shrink-0" />
                                <span>{getLocalizedCategoryName(cat, i18n.language)}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Shift Select */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        {isArabic ? "موعد الوردية" : "Shift Time"}
                      </label>
                      <Select value={selectedShift} onValueChange={setSelectedShift}>
                        <SelectTrigger className="h-11 rounded-xl text-xs bg-background">
                          <SelectValue placeholder={isArabic ? "اختر موعد الوردية..." : "Select shift..."} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">{isArabic ? "كافة الورديات (24 ساعة)" : "Any Shift (24 Hours)"}</SelectItem>
                          <SelectItem value="morning">
                            <div className="flex items-center gap-2">
                              <Sun className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                              <span>{isArabic ? "صباحية (8 ص – 4 م)" : "Morning (8am - 4pm)"}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="evening">
                            <div className="flex items-center gap-2">
                              <Sunset className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                              <span>{isArabic ? "مسائية (4 م – 12 ص)" : "Evening (4pm - 12am)"}</span>
                            </div>
                          </SelectItem>
                          <SelectItem value="night">
                            <div className="flex items-center gap-2">
                              <Moon className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                              <span>{isArabic ? "ليلية (12 ص – 8 ص)" : "Night (12am - 8am)"}</span>
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Area / Location */}
                    <div className="space-y-1.5">
                      <label className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                        {isArabic ? "المنطقة / المحافظة" : "Location"}
                      </label>
                      <div className="relative">
                        <MapPin className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          placeholder={isArabic ? "مثال: التجمع، المعادي، الشيخ زايد" : "e.g. New Cairo, Maadi"}
                          value={locationQuery}
                          onChange={(e) => setLocationQuery(e.target.value)}
                          className="ps-9 h-11 rounded-xl text-xs bg-background"
                        />
                      </div>
                    </div>

                    {/* Search Submit */}
                    <div className="flex flex-col justify-end">
                      <Button
                        type="submit"
                        className="h-11 rounded-xl text-xs font-bold gap-2 shadow-md shadow-primary/20 w-full"
                      >
                        <Search className="h-4 w-4" />
                        <span>{isArabic ? "ابحث عن مزود معتمد" : "Search Providers"}</span>
                      </Button>
                    </div>
                  </div>

                  {/* Trust Micro-Row */}
                  <div className="pt-2 border-t border-border/50 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5">
                        <ShieldCheck className="h-4 w-4 text-primary" />
                        <span>{isArabic ? "بطاقة رقم قومي مدققة" : "National ID Vetted"}</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1.5">
                        <Lock className="h-3.5 w-3.5 text-emerald-600" />
                        <span>{isArabic ? "دفع ضامن إلكتروني" : "Escrow Safeguard"}</span>
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-medium text-foreground">
                      <span className="text-amber-500 font-bold flex items-center gap-1">
                        <Star className="h-3.5 w-3.5 fill-amber-500" /> 4.95 / 5
                      </span>
                      <span className="text-muted-foreground">
                        {isArabic ? "(من أكثر من 3,800 تقييم موثق)" : "(From 3,800+ Verified Reviews)"}
                      </span>
                    </div>
                  </div>
                </form>
              </Card>
            </div>

            {/* Floating Live Simulation Card Preview */}
            <div className="max-w-3xl mx-auto pt-4">
              <div className="p-4 sm:p-6 rounded-3xl bg-gradient-to-r from-card via-card/90 to-primary/5 border border-border/80 shadow-md flex flex-col sm:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <Avatar className="h-14 w-14 rounded-2xl border-2 border-primary/30">
                      <AvatarImage src="https://images.unsplash.com/photo-1594824813576-809d43501a30?w=200&auto=format&fit=crop&q=80" />
                      <AvatarFallback className="rounded-2xl font-bold bg-primary/10 text-primary">MS</AvatarFallback>
                    </Avatar>
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full bg-emerald-500 border-2 border-background" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground">
                        {isArabic ? "أخصائية مريم سمير • تمريض منزلي" : "Mariam Samir, RN • Home Care"}
                      </h4>
                      <Badge className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 text-[10px] border-emerald-500/20">
                        {isArabic ? "متاحة اليوم" : "Available Today"}
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {isArabic ? "الوردية القادمة: صباحية (8:00 ص – 4:00 م)" : "Next Shift: Morning (8:00 AM – 4:00 PM)"}
                    </p>
                    <div className="flex items-center gap-3 text-xs mt-1 text-muted-foreground">
                      <span className="flex items-center gap-1 text-amber-500 font-semibold">
                        <Star className="h-3 w-3 fill-amber-500" /> 5.0 (148 {isArabic ? "تقييم" : "reviews"})
                      </span>
                      <span>•</span>
                      <span className="text-primary font-bold">450 {isArabic ? "ج.م / وردية 8 ساعات" : "EGP / 8-hr Shift"}</span>
                    </div>
                  </div>
                </div>

                <Button size="sm" asChild className="font-semibold shadow-sm w-full sm:w-auto shrink-0">
                  <Link to="/register">
                    <span>{isArabic ? "احجز هذه الوردية" : "Book This Shift"}</span>
                    <DirectionalIcon icon={ArrowRight} className="h-3.5 w-3.5 ms-1.5" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* 4 Pillar Platform Metrics Counters */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 pt-6">
              <Card className="border-border/70 shadow-xs text-center p-5">
                <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-2">
                  <Activity className="h-5 w-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">15,000+</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isArabic ? "وردية نُفذت باحترافية" : "Shifts Fulfilled"}
                </p>
              </Card>

              <Card className="border-border/70 shadow-xs text-center p-5">
                <div className="w-10 h-10 rounded-xl bg-teal-500/10 text-teal-600 dark:text-teal-400 flex items-center justify-center mx-auto mb-2">
                  <UserCheck className="h-5 w-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">1,250+</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isArabic ? "مزود خدمة معتمد ومدقق" : "Vetted Healthcare Aides"}
                </p>
              </Card>

              <Card className="border-border/70 shadow-xs text-center p-5">
                <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-600 flex items-center justify-center mx-auto mb-2">
                  <Star className="h-5 w-5 fill-amber-500" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">4.95 / 5</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isArabic ? "متوسط تقييمات العائلات" : "Client Satisfaction Score"}
                </p>
              </Card>

              <Card className="border-border/70 shadow-xs text-center p-5">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                  <Lock className="h-5 w-5" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">100%</h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {isArabic ? "حماية المدفوعات بالضمان" : "Escrow Payment Safety"}
                </p>
              </Card>
            </div>
          </div>
        </section>

        {/* The Shift System Deep-Dive Section (with shadcn Tabs) */}
        <section id="shifts" className="py-20 bg-muted/30 border-y border-border/70">
          <div className="container max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "ابتكار الأنيس" : "The Shift Advantage"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "لماذا الحجز بالوردية أفضل من عدّاد الساعات؟" : "Why Shift-Based Care Outperforms Hourly Meters"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "وداعاً للقلق من تزايد الساعات والمفاجآت المالية. نظام الوردية يوفر وقتاً كافياً للرعاية المستمرة بسعر ثابت وشفاف مسبقاً."
                  : "Say goodbye to clock-watching and runaway overtime. Standardized 8-hour shifts guarantee dedicated focus with upfront pricing."}
              </p>
            </div>

            {/* Interactive Shift Tabs */}
            <Tabs defaultValue="morning" className="w-full">
              <div className="flex justify-center">
                <TabsList className="h-12 p-1 rounded-2xl bg-card border border-border/70 shadow-xs grid grid-cols-3 max-w-md w-full">
                  <TabsTrigger value="morning" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Sun className="h-4 w-4" />
                    <span>{isArabic ? "صباحية" : "Morning"}</span>
                  </TabsTrigger>
                  <TabsTrigger value="evening" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Sunset className="h-4 w-4" />
                    <span>{isArabic ? "مسائية" : "Evening"}</span>
                  </TabsTrigger>
                  <TabsTrigger value="night" className="rounded-xl text-xs font-bold gap-1.5 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    <Moon className="h-4 w-4" />
                    <span>{isArabic ? "ليلية" : "Night"}</span>
                  </TabsTrigger>
                </TabsList>
              </div>

              {SHIFT_DETAILS.map((shift) => (
                <TabsContent key={shift.id} value={shift.id} className="mt-8">
                  <Card className="border border-border/80 shadow-md bg-card overflow-hidden">
                    <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
                      <div className="space-y-4 lg:col-span-2">
                        <div className="flex items-center gap-3">
                          <div className={`p-3 rounded-2xl ${shift.bg} ${shift.color} border ${shift.border}`}>
                            <shift.icon className="h-7 w-7" />
                          </div>
                          <div>
                            <h3 className="text-2xl font-bold text-foreground">{shift.title}</h3>
                            <p className="text-xs font-semibold text-primary">{shift.time}</p>
                          </div>
                          <Badge variant="secondary" className="ms-auto text-xs">
                            {shift.badge}
                          </Badge>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                            {isArabic ? "أبرز الاستخدامات والحالات:" : "Ideal Use Cases:"}
                          </h4>
                          <p className="text-sm text-foreground/90 leading-relaxed">{shift.bestFor}</p>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">
                            {isArabic ? "ما يشمله نطاق الوردية القياسي:" : "What Is Covered In This Shift:"}
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                            {shift.included.map((item, idx) => (
                              <div key={idx} className="flex items-start gap-2 text-muted-foreground">
                                <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                                <span>{item}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Right Booking Card for this shift */}
                      <div className="p-6 rounded-2xl bg-muted/30 border border-border/60 text-center space-y-4 flex flex-col justify-center">
                        <span className="text-xs font-semibold text-muted-foreground block">
                          {isArabic ? "الأسعار الرسمية المعتمدة" : "Standardized Rate"}
                        </span>
                        <div>
                          <span className="text-3xl font-extrabold text-foreground">
                            {formatPrice(shift.startingRate)}
                          </span>
                          <span className="text-xs text-muted-foreground block mt-0.5">
                            {isArabic ? "لكل وردية 8 ساعات كاملة" : "per full 8-hour shift"}
                          </span>
                        </div>

                        <div className="text-[11px] text-muted-foreground space-y-1.5 bg-card/60 p-2.5 rounded-xl border border-border/50 text-start">
                          <p className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{isArabic ? "ضمان استرداد فوري في حال الإلغاء" : "100% Escrow protected refund"}</span>
                          </p>
                          <p className="flex items-center gap-1.5">
                            <Check className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                            <span>{isArabic ? "تدقيق جنائي للرقم القومي" : "National ID vetted caregiver"}</span>
                          </p>
                        </div>

                        <Button size="lg" asChild className="w-full font-bold">
                          <Link to="/register">
                            <span>{isArabic ? "احجز وردية " + shift.title : "Book " + shift.title}</span>
                            <DirectionalIcon icon={ArrowRight} className="h-4 w-4 ms-1.5" />
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </section>

        {/* Featured Specialties & Services */}
        <section id="categories" className="py-20">
          <div className="container max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs text-primary border-primary/20">
                  {isArabic ? "تخصصات الرعاية المعتمدة" : "Care Specialties"}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {isArabic ? "تخصصات الرعاية والخدمات المنزلية" : "Verified In-Home Healthcare & Aides"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isArabic
                    ? "اختر التخصص المطلوب لاستعراض الكوادر الطبية والمساعدين المتاحين للحجز الفوري."
                    : "Browse verified clinical aides, companions, and certified educators ready for booking."}
                </p>
              </div>

              <Button variant="outline" size="sm" asChild className="self-start sm:self-auto gap-1">
                <Link to="/register">
                  <span>{isArabic ? "استعرض كافة التخصصات" : "View All Specialties"}</span>
                  <DirectionalIcon icon={ChevronRight} className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => {
                const localizedName = getLocalizedCategoryName(cat, i18n.language);
                const desc = isArabic ? (cat.descriptionAr || cat.description) : (cat.description || cat.descriptionAr);
                const startingPrice = cat.startingPrice || 350;

                return (
                  <Card
                    key={cat.id}
                    className="border border-border/80 shadow-xs hover:border-primary/50 hover:shadow-lg transition-all cursor-pointer group rounded-2xl"
                    onClick={() => navigate(`/login?redirect=/app/providers&cat=${cat.id}`)}
                  >
                    <CardContent className="p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="p-3 rounded-2xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                          <CategoryIcon icon={cat.icon} name={cat.name} className="h-6 w-6" />
                        </div>
                        <Badge className="bg-primary/10 text-primary border-primary/20 text-[10px]">
                          {isArabic ? "مدقق ومعتمد" : "Verified"}
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

                      <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                        {desc || (isArabic ? "متخصصون معتمدون جاهزون لحجز الورديات وفق جدولك." : "Certified professionals ready for shift booking on your schedule.")}
                      </p>

                      <div className="pt-3 border-t border-border/60 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">
                          {isArabic ? "يبدأ من" : "From"} <strong className="text-foreground">{formatPrice(startingPrice)}</strong>
                        </span>
                        <span className="font-bold text-primary flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                          <span>{isArabic ? "احجز مزود" : "Explore"}</span>
                          <DirectionalIcon icon={ArrowRight} className="h-3 w-3" />
                        </span>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </section>

        {/* Alanis vs Traditional Comparison Matrix */}
        <section id="why-alanis" className="py-20 bg-muted/40 border-y border-border/70">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "مقارنة حقيقية" : "Market Comparison"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "منصة الأنيس في مواجهة الطرق التقليدية" : "Alanis Platform vs Traditional Agency Care"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "لماذا يفضل آلاف الأسر المصرية حجز الرعاية عبر الأنيس بدلاً من المكاتب العشوائية؟"
                  : "See how our audited shift model solves the pain points of unverified informal care."}
              </p>
            </div>

            <Card className="border border-border/80 shadow-md bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-xs text-start">
                  <thead>
                    <tr className="border-b border-border/70 bg-muted/40 text-foreground">
                      <th className="py-4 px-5 font-bold text-start w-1/3">
                        {isArabic ? "المعيار / الجانب" : "Feature / Aspect"}
                      </th>
                      <th className="py-4 px-5 font-bold text-start bg-primary/10 text-primary border-x border-primary/20 w-1/3">
                        <div className="flex items-center gap-1.5">
                          <ShieldCheck className="h-4 w-4" />
                          <span>{isArabic ? "منصة الأنيس (Alanis)" : "Alanis Platform"}</span>
                        </div>
                      </th>
                      <th className="py-4 px-5 font-bold text-start text-muted-foreground w-1/3">
                        {isArabic ? "المكاتب والوسطاء التقليديون" : "Traditional Agencies / Brokers"}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {COMPARISON_ROWS.map((row, idx) => (
                      <tr key={idx} className="hover:bg-muted/20 transition-colors">
                        <td className="py-4 px-5 font-semibold text-foreground">
                          {row.feature}
                        </td>
                        <td className="py-4 px-5 bg-primary/5 border-x border-primary/15 text-foreground font-medium">
                          <div className="flex items-start gap-2">
                            <Check className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{row.alanis}</span>
                          </div>
                        </td>
                        <td className="py-4 px-5 text-muted-foreground">
                          <div className="flex items-start gap-2">
                            <X className="h-4 w-4 text-destructive/80 shrink-0 mt-0.5" />
                            <span>{row.traditional}</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>
        </section>

        {/* How It Works - Dual Perspective (Tabs for Client & Provider) */}
        <section id="how-it-works" className="py-20">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "خطوات بسيطة" : "Simple Workflow"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "كيف تعمل المنصة في 3 خطوات" : "How Alanis Works in 3 Clear Steps"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "تجربة مصممة لتوفير أعلى درجات السلاسة والاطمئنان سواء كنت تطلب الرعاية أو تقدمها."
                  : "Designed for absolute transparency whether you are booking care for family or offering your skills."}
              </p>
            </div>

            <Tabs defaultValue="clients" className="w-full">
              <div className="flex justify-center">
                <TabsList className="h-11 rounded-2xl bg-muted/60 p-1 border border-border/70">
                  <TabsTrigger value="clients" className="rounded-xl text-xs font-bold px-6">
                    {isArabic ? "للعملاء والأسر" : "For Families & Clients"}
                  </TabsTrigger>
                  <TabsTrigger value="providers" className="rounded-xl text-xs font-bold px-6">
                    {isArabic ? "لمزودي الخدمة والأطباء" : "For Healthcare Aides"}
                  </TabsTrigger>
                </TabsList>
              </div>

              {/* Client Workflow */}
              <TabsContent value="clients" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-border/80 shadow-xs p-6 space-y-4 text-center rounded-2xl relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-primary/25">
                      1
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {isArabic ? "ابحث واختر الوردية" : "Select Shift & Caregiver"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "تصفح أطقم التمريض والرعاية المعتمدة، واطلع على تقييمات العملاء وجدول الورديات المتاح، وحدد موعدك."
                        : "Filter audited caregivers by specialty, read verified client reviews, and choose your preferred 8-hour shift."}
                    </p>
                  </Card>

                  <Card className="border border-border/80 shadow-xs p-6 space-y-4 text-center rounded-2xl relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-primary/25">
                      2
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {isArabic ? "سداد إلكتروني بحساب الضمان" : "Secure Escrow Checkout"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "ادفع بأمان عبر بطاقتك. يحتفظ حساب الضمان بالمبلغ كاملاً، ولا يُحوّل للمزود إلا بعد إتمام الوردية ورضاك."
                        : "Pay safely online. Your funds remain 100% safeguarded in platform escrow until the shift is completed satisfactorily."}
                    </p>
                  </Card>

                  <Card className="border border-border/80 shadow-xs p-6 space-y-4 text-center rounded-2xl relative">
                    <div className="w-12 h-12 rounded-2xl bg-primary text-primary-foreground font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-primary/25">
                      3
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {isArabic ? "تنفيذ الوردية والتقييم" : "Care Delivered & Review"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "نسق التعليمات عبر المحادثة الفورية. بعد اكتمال الوردية، أكد الاستلام وانشر تقييمك لمساعدة باقي الأسر."
                        : "Coordinate instructions via real-time chat. Once care is delivered, confirm completion and leave your review."}
                    </p>
                  </Card>
                </div>
              </TabsContent>

              {/* Provider Workflow */}
              <TabsContent value="providers" className="mt-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="border border-border/80 shadow-xs p-6 space-y-4 text-center rounded-2xl relative">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-teal-600/25">
                      1
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {isArabic ? "سجل وارفع شهاداتك" : "Apply & Submit Credentials"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "سجل حسابك مجاناً وارفع صورة الرقم القومي وتراخيص مزاولة المهنة لمراجعتها من فريق الامتثال."
                        : "Create your free provider account and upload your National ID and healthcare certificates for audit."}
                    </p>
                  </Card>

                  <Card className="border border-border/80 shadow-xs p-6 space-y-4 text-center rounded-2xl relative">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-teal-600/25">
                      2
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {isArabic ? "حدد جدول وردياتك ومناطقك" : "Set Availability & Areas"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "اختر الأيام والورديات (صباحية، مسائية، ليلية) والمناطق الجغرافية التي ترغب في العمل بها بكل حرية."
                        : "Choose open shift slots (Morning, Evening, Night) and geographical neighborhoods that match your schedule."}
                    </p>
                  </Card>

                  <Card className="border border-border/80 shadow-xs p-6 space-y-4 text-center rounded-2xl relative">
                    <div className="w-12 h-12 rounded-2xl bg-teal-600 text-white font-bold text-lg flex items-center justify-center mx-auto shadow-md shadow-teal-600/25">
                      3
                    </div>
                    <h3 className="font-bold text-lg text-foreground">
                      {isArabic ? "نفذ الوردية واستلم أرباحك" : "Fulfill Shifts & Instant Payout"}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {isArabic
                        ? "استقبل طلبات الحجز المباشرة، ونفذ الرعاية باحترافية، واستلم مستحقاتك فوراً من حساب الضمان دون تأخير."
                        : "Receive direct booking alerts, deliver compassionate care, and receive guaranteed instant escrow payouts."}
                    </p>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Top Verified Caregivers Spotlight */}
        <section id="caregivers" className="py-20 bg-muted/30 border-y border-border/70">
          <div className="container max-w-6xl mx-auto space-y-12">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <Badge variant="outline" className="text-xs text-primary border-primary/20">
                  {isArabic ? "نخبة الكوادر" : "Audited Caregivers"}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                  {isArabic ? "تعرف على نماذج من أطقم الرعاية المعتمدة" : "Meet Top Verified Care Providers"}
                </h2>
                <p className="text-sm text-muted-foreground">
                  {isArabic
                    ? "كل ممرض ومساعد رعاية يمر بمطابقة الهوية الجنائية ومراجعة الشهادات قبل الانضمام."
                    : "Every nurse and companion passes National ID verification and syndical license audits."}
                </p>
              </div>

              <Button size="sm" asChild className="self-start sm:self-auto gap-1 shadow-sm">
                <Link to="/register">
                  <span>{isArabic ? "انضم كأخصائي رعاية" : "Join as Caregiver"}</span>
                  <DirectionalIcon icon={ChevronRight} className="h-4 w-4" />
                </Link>
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {SPOTLIGHT_PROVIDERS.map((prov) => (
                <Card key={prov.id} className="border border-border/80 shadow-md bg-card rounded-2xl overflow-hidden hover:border-primary/50 transition-all">
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-16 w-16 rounded-2xl border-2 border-primary/20 shrink-0">
                        <AvatarImage src={prov.avatar} alt={prov.name} />
                        <AvatarFallback className="rounded-2xl font-bold bg-primary/10 text-primary">
                          {getInitials(prov.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5">
                          <h4 className="font-bold text-sm text-foreground truncate">{prov.name}</h4>
                          <BadgeCheck className="h-4 w-4 text-primary shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5 truncate">{prov.title}</p>
                        <Badge variant="secondary" className="text-[10px] mt-1">
                          {prov.badge}
                        </Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                          {isArabic ? "التقييم العام" : "Rating"}
                        </span>
                        <span className="font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                          <Star className="h-3 w-3 fill-amber-500" /> {prov.rating} ({prov.reviewsCount})
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                          {isArabic ? "الورديات المنفذة" : "Completed"}
                        </span>
                        <span className="font-bold text-foreground mt-0.5 block">
                          {prov.shiftsCompleted} {isArabic ? "وردية" : "shifts"}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                          {isArabic ? "نطاق التغطية" : "Service Area"}
                        </span>
                        <span className="text-muted-foreground mt-0.5 block truncate">
                          {prov.location}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground block text-[10px] uppercase font-bold">
                          {isArabic ? "سعر الوردية" : "Shift Rate"}
                        </span>
                        <span className="font-bold text-primary mt-0.5 block">
                          {formatPrice(prov.rate)}
                        </span>
                      </div>
                    </div>

                    <Button asChild className="w-full text-xs font-bold mt-2">
                      <Link to="/register">
                        <span>{isArabic ? "طلب حجز وردية" : "Book Shift with Provider"}</span>
                        <DirectionalIcon icon={ArrowRight} className="h-3.5 w-3.5 ms-1.5" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Client Testimonials */}
        <section id="testimonials" className="py-20">
          <div className="container max-w-5xl mx-auto space-y-12">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "تجارب الأسر" : "Family Stories"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "تجارب حقيقية من عائلات ومقدمي رعاية" : "Real Stories from Egyptian Families"}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {isArabic
                  ? "آراء موثقة من عملاء ومقدمي رعاية اعتمدوا على نظام الوردية لراحة أحبائهم."
                  : "Verified feedback from clients and professionals relying on shift-based care."}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((tItem, idx) => (
                <Card key={idx} className="border border-border/80 shadow-xs rounded-2xl">
                  <CardContent className="p-6 space-y-4 flex flex-col justify-between h-full">
                    <div className="space-y-3">
                      <div className="flex text-amber-400">
                        {[...Array(tItem.rating)].map((_, i) => (
                          <Star key={i} className="h-4 w-4 fill-current" />
                        ))}
                      </div>
                      <p className="text-xs text-foreground/90 leading-relaxed italic">
                        "{tItem.quote}"
                      </p>
                    </div>

                    <div className="pt-3 border-t border-border/60">
                      <p className="font-bold text-xs text-foreground">{tItem.author}</p>
                      <p className="text-[11px] text-muted-foreground">{tItem.role}</p>
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

        {/* FAQ Accordion Section */}
        <section id="faq" className="py-20 bg-muted/30 border-t border-border/70">
          <div className="container max-w-4xl mx-auto space-y-10">
            <div className="text-center space-y-3 max-w-2xl mx-auto">
              <Badge variant="outline" className="text-xs text-primary border-primary/20">
                {isArabic ? "إجابات واضحة" : "FAQ"}
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">
                {isArabic ? "الأسئلة الأكثر شيوعاً" : "Frequently Asked Questions"}
              </h2>
              <p className="text-sm text-muted-foreground">
                {isArabic
                  ? "كل ما تود معرفته عن الدفع الضامن، وتدقيق المستندات، وتنسيق الورديات."
                  : "Everything you need to know about escrow protection, provider audits, and shifts."}
              </p>
            </div>

            <Card className="border border-border/80 shadow-md bg-card p-6 rounded-2xl">
              <Accordion type="single" collapsible className="w-full">
                {FAQS.map((faq, idx) => (
                  <AccordionItem key={idx} value={`faq-${idx}`}>
                    <AccordionTrigger className="text-sm font-bold text-foreground">
                      {faq.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-xs leading-relaxed text-muted-foreground">
                      {faq.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </Card>
          </div>
        </section>

        {/* High-Impact Bottom Call to Action */}
        <section className="py-20 relative overflow-hidden">
          <div className="container max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-primary via-teal-800 to-slate-950 p-8 sm:p-14 text-center text-white overflow-hidden shadow-2xl">
              <div className="absolute -top-24 -left-24 h-72 w-72 rounded-full bg-white/10 blur-2xl pointer-events-none" />
              <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-emerald-400/20 blur-2xl pointer-events-none" />

              <div className="relative z-10 space-y-6 max-w-2xl mx-auto">
                <Badge className="bg-white/15 text-white border-white/20 text-xs px-3 py-1">
                  {isArabic ? "انضم لأكبر مجتمع رعاية موثوق في مصر" : "Join Egypt's Leading Care Network"}
                </Badge>
                <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                  {isArabic ? "جاهز لحجز وردية رعاية مضمونة لأحبائك؟" : "Ready to reserve your first verified shift?"}
                </h2>
                <p className="text-white/80 text-sm sm:text-base leading-relaxed">
                  {isArabic
                    ? "سجل حسابك مجاناً في دقيقتين. تصفح أطقم الرعاية والتمريض المعتمدين، وحدد الوردية، ودعنا نتكفل بحماية أموالك وراحتك."
                    : "Sign up in 2 minutes. Browse vetted healthcare aides, select your 8-hour shift, and enjoy 100% escrow protected dignified care."}
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
                  <Button
                    size="lg"
                    asChild
                    className="w-full sm:w-auto bg-white text-primary hover:bg-white/90 font-bold shadow-xl h-12 px-8"
                  >
                    <Link to="/register">
                      {isArabic ? "احجز وردية الآن" : "Book a Caregiver Shift"}
                    </Link>
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    asChild
                    className="w-full sm:w-auto border-white/40 text-white hover:bg-white/10 h-12 px-8"
                  >
                    <Link to="/login">{t("common:nav.signIn")}</Link>
                  </Button>
                </div>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{isArabic ? "بدون عمولات خفية" : "No hidden broker fees"}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{isArabic ? "حماية الضمان 100%" : "100% Escrow guarantee"}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Check className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
                    <span>{isArabic ? "دعم على مدار الساعة" : "24/7 Support line"}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Comprehensive Professional Footer */}
      <footer className="border-t border-border/80 bg-card/60 py-14">
        <div className="container max-w-6xl mx-auto space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand column */}
            <div className="space-y-4 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="h-9 w-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-bold">
                  <ShieldCheck className="h-5 w-5 text-white" />
                </div>
                <div>
                  <span className="font-extrabold text-foreground text-lg">{t("common:brand.name")}</span>
                  <span className="text-[10px] text-muted-foreground block -mt-0.5">
                    {t("common:brand.subtitle")}
                  </span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {isArabic
                  ? "المنصة الأولى المعتمدة في مصر لحجز خدمات التمريض والرعاية المنزلية بنظام الوردية مع الحماية الكاملة بالدفع الضامن."
                  : "Egypt's premier shift-based marketplace connecting verified caregivers with families under 100% escrow protection."}
              </p>
              <div className="flex items-center gap-2 pt-1">
                <Badge variant="outline" className="text-[10px] text-emerald-600 border-emerald-500/20">
                  {isArabic ? "معتمد وموثق" : "Verified Security"}
                </Badge>
              </div>
            </div>

            {/* Quick Links For Clients */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isArabic ? "للأسر والعملاء" : "For Families"}
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to="/login?redirect=/app/providers" className="hover:text-foreground transition-colors">
                    {isArabic ? "البحث عن مزودين" : "Find Providers"}
                  </Link>
                </li>
                <li>
                  <a href="#shifts" className="hover:text-foreground transition-colors">
                    {isArabic ? "مفهوم الورديات والأسعار" : "Shift System & Pricing"}
                  </a>
                </li>
                <li>
                  <a href="#categories" className="hover:text-foreground transition-colors">
                    {isArabic ? "التخصصات المتاحة" : "Available Specialties"}
                  </a>
                </li>
                <li>
                  <Link to="/register" className="hover:text-foreground transition-colors">
                    {isArabic ? "إنشاء حساب عميل" : "Create Family Account"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* For Providers */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isArabic ? "لمزودي الرعاية" : "For Caregivers"}
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li>
                  <Link to="/register" className="hover:text-foreground transition-colors">
                    {isArabic ? "الانضمام كمزود خدمة" : "Apply as Provider"}
                  </Link>
                </li>
                <li>
                  <a href="#why-alanis" className="hover:text-foreground transition-colors">
                    {isArabic ? "مزايا الدفع الضامن" : "Escrow Earnings"}
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="hover:text-foreground transition-colors">
                    {isArabic ? "شروط التدقيق والاعتماد" : "Vetting Requirements"}
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-foreground transition-colors">
                    {isArabic ? "دخول بوابة المزود" : "Provider Portal Login"}
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact & Hotline */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">
                {isArabic ? "الأمان والمساعدة" : "Trust & Helpline"}
              </h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li className="flex items-center gap-2">
                  <PhoneCall className="h-3.5 w-3.5 text-primary" />
                  <span className="font-mono font-bold text-foreground">19824</span>
                  <span>({isArabic ? "الخط الساخن" : "Hotline"})</span>
                </li>
                <li className="flex items-center gap-2">
                  <Lock className="h-3.5 w-3.5 text-emerald-600" />
                  <span>{isArabic ? "حماية الضمان 100%" : "100% Escrow Protection"}</span>
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  <span>{isArabic ? "القاهرة، جمهورية مصر العربية" : "Cairo, Egypt"}</span>
                </li>
              </ul>
            </div>
          </div>

          <Separator />

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>
              {t("common:footer.copyright", { year: new Date().getFullYear() })}
            </p>
            <div className="flex items-center gap-3">
              <LanguageSwitcher compact />
              <ThemeToggle compact />
              <span>{t("common:footer.escrowBadge")}</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
