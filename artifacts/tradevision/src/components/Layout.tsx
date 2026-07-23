import { Link, useLocation } from "wouter";
import { Activity, ShieldAlert, LineChart, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

export function Layout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();

  return (
    <div className="min-h-[100dvh] bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Global Ambient Glow */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[80vw] h-[50vh] bg-primary/10 rounded-full blur-[120px] pointer-events-none z-0" />
      
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-white/5 bg-background/50 backdrop-blur-xl supports-[backdrop-filter]:bg-background/20">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 border border-primary/30 group-hover:border-primary/50 transition-colors">
              <Activity className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
            </div>
            <span className="font-display font-bold text-lg tracking-tight">
              TradeVision<span className="text-primary">.ai</span>
            </span>
          </Link>
          
          <nav className="flex items-center gap-1 md:gap-4 text-sm font-medium">
            <Link
              href="/binary"
              className={cn(
                "px-3 py-2 rounded-md transition-colors",
                location === "/binary"
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              Binary
            </Link>
            <Link
              href="/forex"
              className={cn(
                "px-3 py-2 rounded-md transition-colors",
                location === "/forex"
                  ? "bg-white/10 text-white"
                  : "text-muted-foreground hover:text-white hover:bg-white/5"
              )}
            >
              Forex
            </Link>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 relative z-10 w-full">
        {children}
      </main>

      {/* Footer */}
      <footer className="border-t border-white/5 py-8 mt-auto z-10 bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground flex flex-col items-center gap-2">
          <ShieldAlert className="w-5 h-5 text-warning/70 mb-2" />
          <p className="max-w-2xl">
            Trading foreign exchange and binary options carries a high level of risk and may not be suitable for all investors. 
            The high degree of leverage can work against you as well as for you.
          </p>
          <p className="opacity-50">
            © {new Date().getFullYear()} TradeVision AI. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
