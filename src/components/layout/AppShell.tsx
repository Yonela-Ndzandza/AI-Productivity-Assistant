import { Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  ShoppingBasket,
  Mail,
  FileText,
  CalendarClock,
  BookOpenText,
  Bot,
  HeartPulse,
  Settings,
  Search,
  Bell,
  Menu,
  Sparkles,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/meal-planner", label: "AI Meal Planner", icon: UtensilsCrossed },
  { to: "/grocery", label: "Grocery List", icon: ShoppingBasket },
  { to: "/email", label: "Smart Email", icon: Mail },
  { to: "/meeting-notes", label: "Meeting Notes", icon: FileText },
  { to: "/task-planner", label: "AI Task Planner", icon: CalendarClock },
  { to: "/research", label: "Research Assistant", icon: BookOpenText },
  { to: "/chat", label: "AI Chat", icon: Bot },
  { to: "/wellness", label: "Wellness Tracker", icon: HeartPulse },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function AppShell({ children }: { children?: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-40 flex h-16 items-center gap-3 border-b border-border bg-card/80 px-4 backdrop-blur lg:px-6">
        <button
          className="rounded-lg p-2 hover:bg-muted lg:hidden"
          onClick={() => setMobileOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/" className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-hero text-white shadow-glow">
            <Sparkles className="h-4 w-4" />
          </span>
          <span className="font-display text-lg font-bold tracking-tight">
            GlowFlow<span className="text-primary"> AI</span>
          </span>
        </Link>

        <div className="relative ml-4 hidden max-w-md flex-1 md:block">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Search meals, tasks, insights..." className="pl-9" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-accent" />
          </Button>
          <div className="flex items-center gap-2 rounded-full border border-border bg-card py-1 pl-1 pr-3">
            <Avatar className="h-7 w-7">
              <AvatarFallback className="bg-gradient-hero text-xs text-white">S</AvatarFallback>
            </Avatar>
            <div className="hidden text-left md:block">
              <div className="text-xs font-semibold leading-none">Sarah Chen</div>
              <div className="text-[10px] text-muted-foreground">Pro plan</div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar - desktop */}
        <aside
          className="sticky top-16 hidden h-[calc(100vh-4rem)] w-64 shrink-0 border-r border-border p-3 lg:block bg-cover bg-center"
          style={{ backgroundImage: "url('/__l5e/assets-v1/8cc4fcba-9a62-49a6-8d61-ce518aca484a/pink-water-bg.jpg')" }}
        >
          <SidebarNav pathname={pathname} />
        </aside>

        {/* Sidebar - mobile drawer */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setMobileOpen(false)}
            />
            <aside className="absolute left-0 top-0 h-full w-72 bg-sidebar p-4 shadow-xl animate-slide-in-right">
              <div className="mb-4 flex items-center justify-between">
                <span className="font-display font-bold">Menu</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-1 hover:bg-muted"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <SidebarNav pathname={pathname} onNavigate={() => setMobileOpen(false)} />
            </aside>
          </div>
        )}

        {/* Main */}
        <main className="min-w-0 flex-1 p-4 lg:p-8">{children ?? <Outlet />}</main>
      </div>
    </div>
  );
}

function SidebarNav({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <nav className="flex h-full flex-col gap-1">
      {nav.map((item) => {
        const active =
          item.to === "/" ? pathname === "/" : pathname.startsWith(item.to);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all",
              active
                ? "bg-gradient-soft text-foreground shadow-card"
                : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "h-4 w-4 transition-colors",
                active ? "text-primary" : "text-muted-foreground group-hover:text-foreground",
              )}
            />
            <span>{item.label}</span>
          </Link>
        );
      })}
      <div className="mt-auto rounded-2xl bg-gradient-hero p-4 text-white shadow-glow">
        <Badge className="bg-white/20 text-white hover:bg-white/25">New</Badge>
        <p className="mt-2 text-sm font-semibold">Snap a meal</p>
        <p className="mt-1 text-xs text-white/80">
          Photo scan any food to check if it fits your anti-inflammatory plan.
        </p>
      </div>
    </nav>
  );
}
