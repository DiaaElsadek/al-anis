import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Shield, Star, Clock, Users } from "lucide-react";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero */}
      <header className="border-b">
        <div className="container flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-primary">
            Alanis
          </Link>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/login">Sign In</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Get Started</Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        {/* Hero Section */}
        <section className="py-20 md:py-32">
          <div className="container text-center space-y-8">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground max-w-3xl mx-auto leading-tight">
              Find Trusted Service Providers{" "}
              <span className="text-primary">Near You</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Book verified professionals for any shift — morning, evening, or
              night. Your trusted marketplace for quality services.
            </p>
            <div className="flex items-center justify-center gap-4">
              <Button size="lg" asChild>
                <Link to="/register">
                  Find a Provider
                  <ArrowRight className="h-4 w-4 ms-2" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/register">Become a Provider</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16 bg-muted/50">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">
              Why Choose Alanis?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  icon: Shield,
                  title: "Verified Providers",
                  description:
                    "All service providers are vetted and verified before joining our platform.",
                },
                {
                  icon: Star,
                  title: "Quality Guaranteed",
                  description:
                    "Read real reviews and ratings from clients who have used our services.",
                },
                {
                  icon: Clock,
                  title: "Flexible Shifts",
                  description:
                    "Book services for morning, evening, or night shifts that fit your schedule.",
                },
                {
                  icon: Users,
                  title: "Wide Selection",
                  description:
                    "Choose from a wide range of service categories and providers in your area.",
                },
              ].map((feature) => (
                <div
                  key={feature.title}
                  className="text-center space-y-3 p-6 rounded-lg bg-background border"
                >
                  <feature.icon className="h-10 w-10 text-primary mx-auto" />
                  <h3 className="text-lg font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Alanis. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
