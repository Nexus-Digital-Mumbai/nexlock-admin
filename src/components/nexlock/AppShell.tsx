import { Link, useRouterState } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, Store, Users, Smartphone, LogOut, Sun, Moon,
  ChevronLeft, ChevronRight, Menu, PanelLeftClose, Lock, ShieldCheck, Settings2, Bell, Network, BarChart3,
  Receipt
} from "lucide-react";
import { Logo } from "./Logo";
import { NotificationDrawer } from "./NotificationDrawer";
import { UniversalSearch } from "./UniversalSearch";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { session } from "@/lib/session";

type NavItem = { to: string; label: string; icon: typeof LayoutDashboard; exact?: boolean };
const nav: NavItem[] = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { to: "/dealers", label: "Dealers", icon: Store },
  { to: "/customers", label: "Customers", icon: Users },
  { to: "/devices", label: "Devices", icon: Smartphone },
  { to: "/analytics", label: "Analytics", icon: BarChart3 },
  { to: "/user-management", label: "User Management", icon: ShieldCheck },
  { to: "/roles", label: "Roles & Permissions", icon: Lock },
  { to: "/notifications", label: "Notifications", icon: Bell },
  { to: "/settings", label: "Platform Settings", icon: Settings2 },
];

// A distributor logs in with a DealerStaff credential (not the admin User system) — the nav
// items above are tenant-wide admin views (every dealer's customers/devices, user management,
// etc.) that a distributor was never meant to see, even where a permission string happens to
// overlap (DealerStaff has device.read/customer.read too, for their own dealer app). Their
// session gets this dedicated nav instead of the admin one entirely — see the isStaff check
// below, not a permission-by-permission filter.
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
        // Platform-wide analytics — same Super-Admin-only gate as the /bi/trends endpoint
        // itself (checked again server-side regardless; this only controls whether the link
        // shows up).
        if (item.to === "/analytics" && user?.role !== "Super Admin") return false;
        if (item.to === "/user-management" && !userPermissions.includes("user.read") && !userPermissions.includes("user.manage")) return false;
        if (item.to === "/roles" && !userPermissions.includes("role.read") && !userPermissions.includes("role.manage")) return false;
        if (item.to === "/settings" && !userPermissions.includes("settings.read") && !userPermissions.includes("settings.write")) return false;
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
    <div className="min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-40 flex flex-col bg-sidebar text-sidebar-foreground border-r border-sidebar-border transition-[width,transform] duration-200",
          collapsed ? "w-[72px]" : "w-[260px]",
          "hidden md:flex",
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
          {collapsed ? <Logo showWordmark={false} /> : <Logo />}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className={cn("rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground", collapsed && "hidden")}
            aria-label="Collapse sidebar"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
          {!collapsed && <div className="px-2 pb-2 pt-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-sidebar-foreground/40">Main</div>}
          {allowedNav.map((item) => {
            const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to as never}
                className={cn(
                  "group relative flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  active
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-sm"
                    : "text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
                  collapsed && "justify-center px-0",
                )}
              >
                <Icon className="h-[18px] w-[18px] shrink-0" />
                {!collapsed && <span className="flex-1 truncate">{item.label}</span>}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-sidebar-border p-3">
          <button
            onClick={handleLogout}
            className={cn(
              "flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-sidebar-foreground/75 hover:bg-sidebar-accent hover:text-sidebar-foreground",
              collapsed && "justify-center px-0",
            )}
          >
            <LogOut className="h-[18px] w-[18px]" />
            {!collapsed && <span>Logout</span>}
          </button>
          {collapsed && (
            <button onClick={() => setCollapsed(false)} className="mt-2 flex w-full items-center justify-center rounded-md p-2 text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-foreground">
              <ChevronRight className="h-4 w-4" />
            </button>
          )}
        </div>
      </aside>

      {/* Mobile sidebar */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 bg-black/40 md:hidden" onClick={() => setMobileOpen(false)} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-[260px] flex-col bg-sidebar text-sidebar-foreground md:hidden">
            <div className="flex h-16 items-center justify-between border-b border-sidebar-border px-4">
              <Logo />
              <button onClick={() => setMobileOpen(false)} className="rounded-md p-1.5 text-sidebar-foreground/70 hover:bg-sidebar-accent">
                <ChevronLeft className="h-4 w-4" />
              </button>
            </div>
            <nav className="flex-1 space-y-0.5 overflow-y-auto p-3">
              {allowedNav.map((item) => {
                const active = item.exact ? pathname === item.to : pathname.startsWith(item.to);
                const Icon = item.icon;
                return (
                  <Link key={item.to} to={item.to as never} onClick={() => setMobileOpen(false)} className={cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
                    active ? "bg-sidebar-primary text-sidebar-primary-foreground" : "text-sidebar-foreground/75 hover:bg-sidebar-accent",
                  )}>
                    <Icon className="h-[18px] w-[18px]" />{item.label}
                  </Link>
                );
              })}
            </nav>
          </aside>
        </>
      )}

      {/* Header + main */}
      <div className={cn("flex min-h-screen flex-col transition-[padding] duration-200", collapsed ? "md:pl-[72px]" : "md:pl-[260px]")}>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-border bg-card/95 px-4 backdrop-blur md:px-6">
          <button className="rounded-md p-2 text-muted-foreground hover:bg-muted md:hidden" onClick={() => setMobileOpen(true)}>
            <Menu className="h-5 w-5" />
          </button>
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
              <Lock className="h-4 w-4" />
            </div>
            <span className="text-sm font-semibold text-foreground">NexLock Admin</span>
          </div>

          <UniversalSearch />

          <div className="ml-auto flex items-center gap-1 md:ml-0">
            <NotificationDrawer />
            <Button variant="ghost" size="icon" className="h-9 w-9" onClick={toggleTheme}>
              {dark ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
            </Button>
            <div className="mx-2 hidden h-6 w-px bg-border md:block" />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 rounded-md p-1 pr-2 hover:bg-muted">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-primary text-primary-foreground text-xs font-semibold">
                      {(user?.name || "Guest").split(" ").map((p: string) => p[0]).slice(0, 2).join("").toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="hidden text-left md:block">
                    <div className="text-xs font-semibold leading-tight">{user?.name || "Guest"}</div>
                    <div className="text-[10px] leading-tight text-muted-foreground">{user?.role || "Operator"}</div>
                  </div>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="w-full cursor-pointer">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-destructive cursor-pointer"
                  onClick={handleLogout}
                >
                  <LogOut className="mr-2 h-4 w-4" />Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </header>

        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
