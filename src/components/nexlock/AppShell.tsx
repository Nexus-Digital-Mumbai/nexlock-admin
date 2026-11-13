import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Store,
  Users,
  Smartphone,
  LogOut,
  Sun,
  Moon,
  ChevronLeft,
  ChevronRight,
  Menu,
  PanelLeftClose,
  Lock,
  ShieldCheck,
  Settings2,
  Bell,
  Network,
  BarChart3,
  Receipt,
  ChevronDown,
  ArrowRight,
  Shield,
  Zap,
} from "lucide-react";
import { Logo } from "./Logo";
import { NotificationDrawer } from "./NotificationDrawer";
import { UniversalSearch } from "./UniversalSearch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { session } from "@/lib/session";

type NavItem = {
  to: string;
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
  badge?: string;
};

const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dealers", label: "Dealers", icon: Store },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/devices", label: "Devices", icon: Smartphone },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/user-management", label: "Users & Roles", icon: ShieldCheck },
  { to: "/roles", label: "Access Control", icon: Lock },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Settings", icon: Settings2 },
];

const distributorNav: NavItem[] = [
  { to: "/distributor", label: "My Quota & Connectors", icon: Network, exact: true },
  { to: "/distributor-analytics", label: "Analytics", icon: BarChart3, exact: true },
  { to: "/distributor-billing", label: "Billing", icon: Receipt, exact: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const user = session.getUser();
  const userPermissions: string[] = user?.permissions || [];

  const allowedNav = user?.isStaff
    ? distributorNav
    : nav.filter((item) => {
        if (item.to === "/dealers" && !userPermissions.includes("dealer.read")) return false;
        if (item.to === "/customers" && !userPermissions.includes("customer.read")) return false;
        if (item.to === "/devices" && !userPermissions.includes("device.read")) return false;
        if (item.to === "/analytics" && user?.role !== "Super Admin") return false;
        if (
          item.to === "/user-management" &&
          !userPermissions.includes("user.read") &&
          !userPermissions.includes("user.manage")
        )
          return false;
        if (
          item.to === "/roles" &&
          !userPermissions.includes("role.read") &&
          !userPermissions.includes("role.manage")
        )
          return false;
        if (
          item.to === "/settings" &&
          !userPermissions.includes("settings.read") &&
          !userPermissions.includes("settings.write")
        )
          return false;
        return true;
      });

  const handleLogout = () => {
    session.logout();
  };

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
  };

  return (
    <div className="min-h-screen bg-transparent text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Desktop Frosted Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-white/45 dark:bg-slate-950/70 backdrop-blur-2xl border-r border-white/75 dark:border-white/10 transition-all duration-300 ease-in-out shadow-[0_20px_50px_rgba(80,85,120,0.06)]",
          collapsed ? "w-[80px]" : "w-[260px]",
          "hidden md:flex",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-white/60 dark:border-white/10 px-5">
          {collapsed ? (
            <div className="mx-auto">
              <Logo showWordmark={false} />
            </div>
          ) : (
            <div className="flex items-center">
              <Logo />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-xl p-1.5 text-muted-foreground/80 hover:bg-white/60 hover:text-foreground transition-colors cursor-pointer",
              collapsed && "hidden"
            )}
            aria-label="Collapse sidebar"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation list */}
        <nav className="flex-1 space-y-1.5 overflow-y-auto px-3.5 py-5">
          {allowedNav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as never}
                title={collapsed ? item.label : undefined}
                className={cn(
                  "group relative flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                  active
                    ? "bg-[#E5E1FE] dark:bg-indigo-600/30 text-[#252066] dark:text-indigo-200 font-semibold shadow-xs border border-white/80 dark:border-white/15"
                    : "text-[#555C7A] dark:text-slate-300 hover:bg-white/55 dark:hover:bg-white/10 hover:text-[#181B34] dark:hover:text-white",
                  collapsed && "justify-center px-0 h-11 w-11 mx-auto rounded-xl",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    active
                      ? "text-[#4338CA] dark:text-indigo-400"
                      : "text-[#6B7280] dark:text-slate-400 group-hover:text-[#181B34] dark:group-hover:text-white"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate tracking-tight text-[13.5px]">{item.label}</span>
                )}
                {active && !collapsed && (
                  <span className="h-1.5 w-1.5 rounded-full bg-[#4338CA] dark:bg-indigo-400 animate-pulse" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Feature Spotlight Card (Inspired by Reference Design) */}
        {!collapsed && (
          <div className="px-3.5 pb-3">
            <div className="relative overflow-hidden rounded-2xl border border-white/80 dark:border-white/15 bg-white/60 dark:bg-white/5 p-4 shadow-sm backdrop-blur-xl">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="text-[12px] font-bold text-foreground tracking-tight">
                  Secure. Manage. Control.
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
                Smarter Device Management with NexLock MDM.
              </p>
              <Link
                to="/devices"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#1A1C30] dark:bg-primary px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs hover:bg-[#282B48] transition-all"
              >
                <span>Learn More</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}

        {/* User Card / Footer */}
        <div className="border-t border-white/60 dark:border-white/10 p-3.5 bg-white/30 dark:bg-white/5">
          {!collapsed ? (
            <div className="flex items-center justify-between rounded-xl p-1.5 hover:bg-white/50 dark:hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-9 w-9 ring-2 ring-white/80 dark:ring-white/10 shrink-0 shadow-xs">
                  <AvatarFallback className="bg-primary/20 text-primary font-bold text-xs">
                    {(user?.name || "Somya Tiwari")
                      .split(" ")
                      .map((p: string) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-foreground">
                    {user?.name || "Somya Tiwari"}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground">
                    {user?.role || "Super Admin"}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="rounded-xl p-2 text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <button
                onClick={handleLogout}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-rose-500/10 hover:text-rose-600 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="h-4 w-4" />
              </button>
              <button
                onClick={() => setCollapsed(false)}
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-white/60 hover:text-foreground transition-colors cursor-pointer"
                title="Expand sidebar"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* Mobile Drawer */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white/95 dark:bg-slate-950/95 backdrop-blur-2xl text-foreground md:hidden shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex h-18 items-center justify-between border-b border-border/80 px-5">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-black/5"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex-1 space-y-1.5 overflow-y-auto p-4">
              {allowedNav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to as never}
                    onClick={() => setMobileOpen(false)}
                    className={cn(
                      "flex items-center gap-3.5 rounded-2xl px-4 py-3 text-sm font-medium transition-colors",
                      active
                        ? "bg-[#E5E1FE] text-[#252066] font-semibold shadow-xs"
                        : "text-[#555C7A] hover:bg-white/60",
                    )}
                  >
                    <Icon className="h-5 w-5 text-primary" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-border/80 p-4">
              <button
                onClick={handleLogout}
                className="flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-5 w-5" />
                <span>Sign out</span>
              </button>
            </div>
          </aside>
        </>
      )}

      {/* Main Content Area */}
      <div
        className={cn(
          "flex min-h-screen flex-col transition-all duration-300 ease-in-out",
          collapsed ? "md:pl-[80px]" : "md:pl-[260px]"
        )}
      >
        {/* Floating Glass Top Bar */}
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-4 px-5 md:px-8 py-3">
          <div className="flex items-center gap-3 flex-1">
            <button
              className="rounded-full h-11 w-11 flex items-center justify-center border border-white/80 bg-white/70 backdrop-blur-xl text-muted-foreground hover:bg-white md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open navigation menu"
            >
              <Menu className="h-5 w-5" />
            </button>

            {/* Pill Universal Search */}
            <UniversalSearch />
          </div>

          {/* Right Action Icons: Notification Pill, Theme Switcher, User Capsule */}
          <div className="flex items-center gap-3">
            <NotificationDrawer />

            <button
              className="h-11 w-11 flex items-center justify-center rounded-full border border-white/90 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xs text-foreground/80 hover:bg-white hover:text-foreground hover:shadow-md transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30"
              onClick={toggleTheme}
              title={dark ? "Switch to light mode" : "Switch to dark mode"}
            >
              {dark ? (
                <Sun className="h-4.5 w-4.5 text-amber-400 transition-transform hover:rotate-45" />
              ) : (
                <Moon className="h-4.5 w-4.5 text-slate-700 transition-transform hover:-rotate-12" />
              )}
            </button>

            {/* User Capsule */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 h-11 pl-1.5 pr-4 rounded-full border border-white/90 dark:border-white/15 bg-white/70 dark:bg-white/10 backdrop-blur-xl shadow-xs hover:bg-white dark:hover:bg-white/20 transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                  <Avatar className="h-8 w-8 ring-2 ring-white/90 dark:ring-white/20 shadow-xs">
                    <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                      {(user?.name || "Somya Tiwari")
                        .split(" ")
                        .map((p: string) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs font-bold leading-tight text-foreground">
                      {user?.name || "Somya Tiwari"}
                    </div>
                    <div className="text-[10px] leading-tight text-muted-foreground">
                      {user?.role || "Super Admin"}
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl border border-white/80 dark:border-white/15 bg-white/90 dark:bg-slate-900/95 p-2 shadow-2xl backdrop-blur-2xl"
              >
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none">{user?.name || "Somya Tiwari"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user?.email || "admin@nexus.io"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer rounded-xl font-medium px-3 py-2">
                    Profile & Security
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer rounded-xl font-medium px-3 py-2">
                    Platform Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive font-medium cursor-pointer rounded-xl px-3 py-2 focus:bg-destructive/10 focus:text-destructive"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        {/* Page Main Content */}
        <main className="flex-1 p-5 md:p-8 animate-fade-up max-w-[1600px] w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
