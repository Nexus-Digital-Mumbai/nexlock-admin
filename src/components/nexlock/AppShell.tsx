import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Store,
  Users,
  Smartphone,
  LogOut,
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
import { ThemeToggle } from "./ThemeToggle";
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

  return (
    <div className="min-h-screen bg-transparent text-foreground antialiased selection:bg-primary/20 selection:text-primary">
      {/* Desktop Frosted Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar backdrop-blur-2xl border-r border-sidebar-border transition-all duration-300 ease-in-out shadow-[0_20px_50px_rgba(7,27,94,0.06)] dark:shadow-[0_20px_50px_rgba(2,11,28,0.7)]",
          collapsed ? "w-[80px]" : "w-[260px]",
          "hidden md:flex",
        )}
      >
        {/* Brand Header */}
        <div className="flex h-20 items-center justify-between border-b border-sidebar-border/80 px-5">
          {collapsed ? (
            <div className="mx-auto">
              <Logo size="md" withPulse={true} />
            </div>
          ) : (
            <div className="flex items-center">
              <Logo size="md" />
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn(
              "rounded-xl p-1.5 text-muted-foreground/80 hover:bg-white/60 dark:hover:bg-white/10 hover:text-foreground transition-colors cursor-pointer",
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
                    ? "bg-gradient-to-r from-[#0755D8] to-[#008CFF] dark:from-[#006BFF] dark:to-[#008CFF] text-white font-semibold shadow-[0_4px_16px_rgba(7,85,216,0.3)] dark:shadow-[0_4px_16px_rgba(0,107,255,0.4)]"
                    : "text-[#4B6188] dark:text-[#8CA5C8] hover:bg-white/60 dark:hover:bg-[#0B1D38]/60 hover:text-[#071B5E] dark:hover:text-[#F5F8FF]",
                  collapsed && "justify-center px-0 h-11 w-11 mx-auto rounded-xl",
                )}
              >
                <Icon
                  className={cn(
                    "h-5 w-5 shrink-0 transition-transform duration-200 group-hover:scale-105",
                    active
                      ? "text-white"
                      : "text-[#4B6188] dark:text-[#8CA5C8] group-hover:text-[#071B5E] dark:group-hover:text-[#00D4FF]"
                  )}
                />
                {!collapsed && (
                  <span className="flex-1 truncate tracking-tight text-[13.5px]">{item.label}</span>
                )}
                {active && !collapsed && (
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white/80 dark:bg-[#00D4FF] opacity-75" />
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-white dark:bg-[#00D4FF]" />
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Feature Spotlight Card (Inspired by Reference Design) */}
        {!collapsed && (
          <div className="px-3.5 pb-3">
            <div className="relative overflow-hidden card-surface p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 dark:bg-[#006BFF]/15 text-primary dark:text-[#00D4FF] border border-primary/20 dark:border-[#006BFF]/30">
                  <Shield className="h-4 w-4" />
                </div>
                <div className="text-[12px] font-bold text-foreground dark:text-[#F5F8FF] tracking-tight">
                  Secure. Manage. Control.
                </div>
              </div>
              <p className="text-[11px] text-muted-foreground dark:text-[#8CA5C8] leading-relaxed mb-3">
                Smarter Device Management with NexLock MDM.
              </p>
              <Link
                to="/devices"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#071B5E] hover:bg-[#0755D8] dark:bg-[#006BFF] dark:hover:bg-[#00D4FF] dark:hover:text-[#020B1C] px-3 py-1.5 text-[11px] font-semibold text-white shadow-xs transition-all"
              >
                <span>Learn More</span>
                <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          </div>
        )}

        {/* User Card / Footer */}
        <div className="border-t border-sidebar-border/80 p-3.5 bg-sidebar/50">
          {!collapsed ? (
            <div className="flex items-center justify-between rounded-xl p-1.5 hover:bg-white/50 dark:hover:bg-white/5 transition-colors">
              <div className="flex items-center gap-2.5 min-w-0">
                <Avatar className="h-9 w-9 ring-2 ring-white/80 dark:ring-[#164675] shrink-0 shadow-xs">
                  <AvatarFallback className="bg-primary/15 dark:bg-[#006BFF]/20 text-primary dark:text-[#00D4FF] font-bold text-xs">
                    {(user?.name || "Somya Tiwari")
                      .split(" ")
                      .map((p: string) => p[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0">
                  <div className="truncate text-xs font-bold text-foreground dark:text-[#F5F8FF]">
                    {user?.name || "Somya Tiwari"}
                  </div>
                  <div className="truncate text-[10px] text-muted-foreground dark:text-[#8CA5C8]">
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
                className="flex h-10 w-10 items-center justify-center rounded-xl text-muted-foreground hover:bg-primary/10 dark:hover:bg-[#006BFF]/15 hover:text-primary dark:hover:text-[#00D4FF] transition-colors cursor-pointer"
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
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[280px] flex-col bg-white/95 dark:bg-[#061329] border-r border-white/80 dark:border-[#164675] backdrop-blur-2xl text-foreground dark:text-[#F5F8FF] md:hidden shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="flex h-18 items-center justify-between border-b border-white/70 dark:border-[#164675] px-5">
              <Logo />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-xl p-1.5 text-muted-foreground hover:bg-white/10"
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
                        ? "bg-gradient-to-r from-[#0755D8] to-[#008CFF] dark:from-[#006BFF] dark:to-[#008CFF] text-white font-semibold shadow-xs"
                        : "text-[#4B6188] dark:text-[#8CA5C8] hover:bg-white/60 dark:hover:bg-[#0B1D38]/60 hover:text-[#071B5E] dark:hover:text-[#F5F8FF]",
                    )}
                  >
                    <Icon className={cn("h-5 w-5", active ? "text-white" : "text-[#4B6188] dark:text-[#8CA5C8]")} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="border-t border-white/70 dark:border-[#164675] p-4 flex items-center justify-between gap-2">
              <ThemeToggle variant="pill" />
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 rounded-xl px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10 transition-colors"
              >
                <LogOut className="h-4 w-4" />
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
              className="rounded-full h-11 w-11 flex items-center justify-center glass-pill text-foreground hover:border-primary/40 md:hidden shadow-xs"
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

            {/* Official Nexus Theme Toggle */}
            <ThemeToggle />

            {/* User Capsule */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-3 h-11 pl-1.5 pr-4 rounded-full glass-pill hover:border-primary/40 hover:bg-white/80 dark:hover:bg-[#0B1D38] transition-all duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/30">
                  <Avatar className="h-8 w-8 ring-2 ring-white/80 dark:ring-[#164675] shadow-xs">
                    <AvatarFallback className="bg-primary/15 dark:bg-[#006BFF]/20 text-primary dark:text-[#00D4FF] text-xs font-bold">
                      {(user?.name || "Somya Tiwari")
                        .split(" ")
                        .map((p: string) => p[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left sm:block">
                    <div className="text-xs font-bold leading-tight text-foreground dark:text-[#F5F8FF]">
                      {user?.name || "Somya Tiwari"}
                    </div>
                    <div className="text-[10px] leading-tight text-muted-foreground dark:text-[#8CA5C8]">
                      {user?.role || "Super Admin"}
                    </div>
                  </div>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground dark:text-[#8CA5C8] shrink-0 hidden sm:block" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-56 rounded-2xl card-elevated p-2 shadow-2xl text-foreground dark:text-[#F5F8FF]"
              >
                <DropdownMenuLabel className="font-normal px-3 py-2">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-bold leading-none text-foreground dark:text-[#F5F8FF]">{user?.name || "Somya Tiwari"}</p>
                    <p className="text-xs leading-none text-muted-foreground dark:text-[#8CA5C8]">
                      {user?.email || "admin@nexus.io"}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-border/60 dark:bg-[#164675]/60" />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer rounded-xl font-medium px-3 py-2 text-foreground dark:text-[#F5F8FF] hover:bg-primary/10 dark:hover:bg-[#006BFF]/15 hover:text-primary dark:hover:text-[#00D4FF]">
                    Profile & Security
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/settings" className="w-full cursor-pointer rounded-xl font-medium px-3 py-2 text-foreground dark:text-[#F5F8FF] hover:bg-primary/10 dark:hover:bg-[#006BFF]/15 hover:text-primary dark:hover:text-[#00D4FF]">
                    Platform Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-border/60 dark:bg-[#164675]/60" />
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
