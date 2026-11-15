import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import { ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";

import appCss from "../styles.css?url";
import nexusIcon from "@/assets/nexus-icon.png";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "@/components/nexlock/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { session } from "@/lib/session";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="card-surface max-w-md p-8 text-center animate-fade-up">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-muted text-muted-foreground">
          <AlertCircle className="h-7 w-7 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground">404</h1>
        <h2 className="mt-2 text-lg font-semibold text-foreground">Page Not Found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The console endpoint or resource you requested cannot be located.</p>
        <div className="mt-6 flex justify-center">
          <Link to="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 transition-all">
            Return to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: unknown; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="card-surface max-w-md p-8 text-center animate-fade-up">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive">
          <AlertCircle className="h-7 w-7" />
        </div>
        <h1 className="text-xl font-bold text-foreground">Unable to Load View</h1>
        <p className="mt-2 text-sm text-muted-foreground">An unexpected runtime issue occurred. Please retry or contact support if the issue persists.</p>
        <div className="mt-6 flex justify-center gap-3">
          <button onClick={() => { router.invalidate(); reset(); }} className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary/90 transition-all">
            <RefreshCw className="h-4 w-4" /> Try again
          </button>
          <a href="/" className="inline-flex items-center rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:bg-muted transition-all">
            Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Nexus — Enterprise Device Financing Admin" },
      { name: "description", content: "Nexus administrator console for Android device financing, EMI collections and device security." },
      { property: "og:title", content: "Nexus — Enterprise Device Financing Admin" },
      { name: "twitter:title", content: "Nexus — Enterprise Device Financing Admin" },
      { property: "og:description", content: "Nexus administrator console for Android device financing, EMI collections and device security." },
      { name: "twitter:description", content: "Nexus administrator console for Android device financing, EMI collections and device security." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da6efa99-dcb5-4aec-b4ed-59ad822296cc/id-preview-ede2b605--35028105-fc3e-4849-a6ed-2a01a91ed75a.lovable.app-1782847687941.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da6efa99-dcb5-4aec-b4ed-59ad822296cc/id-preview-ede2b605--35028105-fc3e-4849-a6ed-2a01a91ed75a.lovable.app-1782847687941.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "shortcut icon", href: nexusIcon },
      { rel: "icon", type: "image/png", href: nexusIcon },
      { rel: "apple-touch-icon", href: nexusIcon },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthRoute = pathname === "/login" || pathname === "/distributor-login" || pathname === "/privacy" || pathname === "/terms";
  return (
    <QueryClientProvider client={queryClient}>
      {isAuthRoute ? (
        <Outlet />
      ) : (
        <AuthGate>
          <AppShell>
            <Outlet />
          </AppShell>
        </AuthGate>
      )}
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

function AuthGate({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  useEffect(() => {
    if (!session.isAuthenticated()) {
      window.location.replace("/login");
      return;
    }
    // A distributor (DealerStaff login) never sees the tenant-wide admin panel — confine them
    // to their own portal regardless of which URL they landed on, same boundary AppShell's nav
    // already enforces for links, but this also covers direct navigation/deep links.
    if (session.getUser()?.isStaff && !pathname.startsWith("/distributor")) {
      window.location.replace("/distributor");
      return;
    }
    setReady(true);
  }, [pathname]);
  if (!ready) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
        <div className="relative flex h-20 w-20 items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/80 dark:border-white/15 bg-white/80 dark:bg-white/10 p-2 shadow-lg backdrop-blur-xl">
            <img
              src="/nexus-icon.png"
              alt="Nexus"
              className="h-full w-full object-contain animate-pulse"
            />
          </div>
        </div>
        <p className="mt-5 text-xs font-semibold tracking-wider uppercase text-muted-foreground animate-pulse">Initializing Nexus Console…</p>
      </div>
    );
  }
  return <>{children}</>;
}

