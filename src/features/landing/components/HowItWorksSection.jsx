import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function HowItWorksSection({ isArabic }) {
  return (
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
  );
}
