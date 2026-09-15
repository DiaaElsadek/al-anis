import { Moon, Sun, Sunset } from "lucide-react";

export function getShiftDetails(isArabic) {
  return [
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
}

export function getSpotlightProviders(isArabic) {
  return [
    {
      id: "prov-1",
      name: isArabic ? "أخصائية مريم سمير" : "Nurse Mariam Samir, RN",
      title: isArabic ? "أخصائية تمريض منزلي ورعاية حرجة" : "Home Healthcare & ICU Specialist",
      specialty: isArabic ? "تمريض منزلي" : "Home Nursing",
      avatar:
        "https://images.unsplash.com/photo-1594824813576-809d43501a30?w=200&auto=format&fit=crop&q=80",
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
      avatar:
        "https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=200&auto=format&fit=crop&q=80",
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
      avatar:
        "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&auto=format&fit=crop&q=80",
      rating: 4.95,
      reviewsCount: 96,
      shiftsCompleted: 180,
      rate: 350,
      badge: isArabic ? "دبلوم رياض أطفال • إسعافات أولية" : "Early Childhood • Pediatric CPR",
      location: isArabic ? "مصر الجديدة • مدينة نصر" : "Heliopolis • Nasr City",
      shiftsAvailable: isArabic ? "مسائية • ليلية" : "Evening • Night",
    },
  ];
}

export function getComparisonRows(isArabic) {
  return [
    {
      feature: isArabic ? "آلية التسعير والتكلفة" : "Pricing Model",
      alanis: isArabic
        ? "سعر ثابت محدد لكل وردية 8 ساعات دون مفاجآت"
        : "Fixed price per 8-hr shift with no hidden costs",
      traditional: isArabic
        ? "عدّاد ساعات مفتوح مع رسوم إضافية غير متوقعة"
        : "Unpredictable hourly meter with sudden overtime",
      advantage: true,
    },
    {
      feature: isArabic ? "أمان المدفوعات وضمان الأموال" : "Payment Protection",
      alanis: isArabic
        ? "دفع ضامن إلكتروني 100%؛ لا يُسلّم المال إلا بعد الرضا"
        : "100% digital escrow; released only after shift satisfaction",
      traditional: isArabic
        ? "دفع نقدي مسبق دون ضمان أو حق استرداد قانوني"
        : "Cash upfront without receipts or legal guarantees",
      advantage: true,
    },
    {
      feature: isArabic ? "تدقيق الأوراق والهوية الجنائية" : "Identity & Vetting",
      alanis: isArabic
        ? "فحص الرقم القومي، والفيش الجنائي، والشهادات الطبية"
        : "14-digit National ID verification, criminal check, licenses",
      traditional: isArabic
        ? "معارف وتوصيات شفهية دون سجلات موثقة رسمياً"
        : "Informal word-of-mouth without background check",
      advantage: true,
    },
    {
      feature: isArabic ? "التنسيق والتواصل المباشر" : "Direct Coordination",
      alanis: isArabic
        ? "محادثة فورية آمنة مع المزود قبل وأثناء الوردية"
        : "Instant secure in-app chat with the verified caregiver",
      traditional: isArabic
        ? "وسطاء ومكاتب سمسرة تأخذ عمولات وتعطل التواصل"
        : "Middleman brokers taking cuts and delaying requests",
      advantage: true,
    },
    {
      feature: isArabic ? "إمكانية الاستبدال والتعويض" : "Replacement Guarantee",
      alanis: isArabic
        ? "استرداد فوري أو حجز مزود بديل معتمد فوراً"
        : "Instant 100% escrow refund or instant replacement",
      traditional: isArabic
        ? "مماطلة من المكاتب وفقدان العربون المدفوع"
        : "Lost deposits and unfulfilled replacement promises",
      advantage: true,
    },
  ];
}

export function getFaqs(isArabic) {
  return [
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
}

export function getTestimonials(isArabic) {
  return [
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
}
