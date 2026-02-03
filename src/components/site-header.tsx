import Link from "next/link";

import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="border-b bg-background/80 backdrop-blur">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="text-lg font-semibold">
          VibeTrader
        </Link>
        <div className="flex items-center gap-3">
          <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
            <Link href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </Link>
            <Link href="#api" className="text-muted-foreground hover:text-foreground">
              API Ready
            </Link>
            <Link href="#cta" className="text-muted-foreground hover:text-foreground">
              Get Started
            </Link>
          </nav>
          <ThemeToggle />
          <Button size="sm">Request access</Button>
        </div>
      </div>
    </header>
  );
}
