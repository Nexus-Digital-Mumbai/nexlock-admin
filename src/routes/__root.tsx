import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet, Link, createRootRouteWithContext, useRouter, useRouterState, HeadContent, Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import nexlockLogo from "@/assets/nexlock-logo.jpeg";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppShell } from "@/components/nexlock/AppShell";
import { Toaster } from "@/components/ui/sonner";
import { session } from "@/lib/session";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-foreground">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-foreground">Page not found</h2>
        <p className="mt-2 text-sm text-muted-foreground">The page you're looking for doesn't exist.</p>
        <div className="mt-6">
          <Link to="/" className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Go to dashboard
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
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold text-foreground">This page didn't load</h1>
        <p className="mt-2 text-sm text-muted-foreground">Something went wrong. Try refreshing.</p>
        <div className="mt-6 flex justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">Try again</button>
          <a href="/" className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent">Go home</a>
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
      { title: "NexLock — Enterprise Device Financing Admin" },
      { name: "description", content: "NexLock administrator console for Android device financing, EMI collections and device security." },
      { property: "og:title", content: "NexLock — Enterprise Device Financing Admin" },
      { name: "twitter:title", content: "NexLock — Enterprise Device Financing Admin" },
      { property: "og:description", content: "NexLock administrator console for Android device financing, EMI collections and device security." },
      { name: "twitter:description", content: "NexLock administrator console for Android device financing, EMI collections and device security." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da6efa99-dcb5-4aec-b4ed-59ad822296cc/id-preview-ede2b605--35028105-fc3e-4849-a6ed-2a01a91ed75a.lovable.app-1782847687941.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/da6efa99-dcb5-4aec-b4ed-59ad822296cc/id-preview-ede2b605--35028105-fc3e-4849-a6ed-2a01a91ed75a.lovable.app-1782847687941.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "shortcut icon", href: nexlockLogo },
      { rel: "icon", type: "image/jpeg", href: nexlockLogo },
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" },
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
    return <div className="flex min-h-screen items-center justify-center bg-background text-sm text-muted-foreground">Loading…</div>;
  }
  return <>{children}</>;
}

