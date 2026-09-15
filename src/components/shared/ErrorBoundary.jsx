import React from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an unhandled error:", error, errorInfo);
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
          <Card className="max-w-md w-full border-border/80 shadow-lg text-center p-6 space-y-5">
            <CardContent className="p-0 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-destructive/10 text-destructive flex items-center justify-center mx-auto">
                <AlertTriangle className="h-7 w-7" />
              </div>

              <div className="space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-foreground">
                  حدث خطأ غير متوقع / Something went wrong
                </h2>
                <p className="text-xs text-muted-foreground">
                  {this.state.error?.message || "An unexpected rendering error occurred."}
                </p>
              </div>

              <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-2">
                <Button
                  onClick={this.handleReload}
                  className="w-full sm:w-auto text-xs font-semibold gap-2"
                >
                  <RefreshCw className="h-3.5 w-3.5" />
                  <span>إعادة تحميل الصفحة / Reload</span>
                </Button>
                <Button
                  variant="outline"
                  onClick={this.handleGoHome}
                  className="w-full sm:w-auto text-xs font-semibold gap-2"
                >
                  <Home className="h-3.5 w-3.5" />
                  <span>الصفحة الرئيسية / Home</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}
