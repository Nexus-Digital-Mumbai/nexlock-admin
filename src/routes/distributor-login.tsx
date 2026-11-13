import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Network, ShieldCheck, ArrowRight, Layers, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";

export const Route = createFileRoute("/distributor-login")({
  head: () => ({
    meta: [
      { title: "Distributor Portal Sign In — Nexus" },
      { name: "description", content: "Sign in to manage your quota pool, connector dealers, and device enrollments." },
    ],
  }),
  component: DistributorLoginPage,
});

function DistributorLoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session.isAuthenticated()) {
      navigate({ to: "/distributor" });
    }
  }, [navigate]);

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    apiClient
      .post("/dealer-staff/login", { email, password })
      .then((data) => {
        if (data.success) {
          session.setAccessToken(data.data.accessToken);
          session.setUser(data.data.staff);
          session.broadcastLogin();
          toast.success("Login successful", { description: "Welcome to Nexus Distributor Portal." });
          navigate({ to: "/distributor" });
        } else {
          toast.error("Sign in failed", { description: data.message || "Invalid credentials" });
        }
      })
      .catch((err) => {
        toast.error("Authentication Error", { description: err.message || "Connection failed to server" });
      })
      .finally(() => {
        setLoading(false);
      });
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden antialiased selection:bg-primary/20">
      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-12 lg:px-12">
        {/* Left Information Panel */}
        <div className="hidden lg:col-span-7 lg:block space-y-7 animate-fade-up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/80 dark:border-white/15 bg-white/70 dark:bg-white/10 px-4 py-1.5 text-xs font-semibold text-[#4338CA] dark:text-indigo-300 shadow-xs backdrop-blur-xl">
            <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse" />
            Nexus Distributor & Quota Ecosystem
          </div>

          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <img
                src="/nexus-official-logo.png"
                alt="NEXUS"
                className="h-14 w-auto max-w-[280px] object-contain"
              />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#14172C] dark:text-white sm:text-5xl lg:text-[46px] leading-[1.18]">
              Manage Quota Pools & Sub-Dealer Networks.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#5A5F7A] dark:text-slate-300">
              Allocate device enrollment limits to connector shops, review distributor billings, track live device activations, and streamline hardware onboarding under a single unified quota.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "Quota Distribution",
                desc: "Allocate and rebalance Android & iOS limits across retail branches.",
                icon: Layers,
              },
              {
                title: "Sub-Dealer Connectors",
                desc: "Authorize new retail partner stores and manage staff logins seamlessly.",
                icon: Network,
              },
              {
                title: "Live Activation Tracking",
                desc: "Real-time metrics for enrolled, active, and completed financing plans.",
                icon: Smartphone,
              },
              {
                title: "Single Sign-On",
                desc: "Use your existing Dealer mobile app credentials for instant access.",
                icon: ShieldCheck,
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-2xl border border-white/80 dark:border-white/10 bg-white/55 dark:bg-slate-900/50 p-4.5 shadow-sm backdrop-blur-xl transition-all hover:bg-white/70 dark:hover:bg-slate-900/70"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary mb-2.5">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm font-bold text-[#14172C] dark:text-white">{f.title}</h2>
                <p className="mt-1 text-xs text-[#64748B] dark:text-slate-400 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Distributor Login Card */}
        <div className="mx-auto w-full max-w-md lg:col-span-5 animate-fade-up">
          <div className="mb-6 flex justify-center lg:hidden">
            <img
              src="/nexus-official-logo.png"
              alt="NEXUS"
              className="h-12 w-auto max-w-[220px] object-contain"
            />
          </div>

          <div className="overflow-hidden rounded-3xl border border-white/85 dark:border-white/15 bg-white/70 dark:bg-slate-900/80 p-8 sm:p-9 shadow-[0_20px_50px_rgba(80,85,120,0.12)] backdrop-blur-2xl">
            <div className="mb-6 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#4338CA] dark:text-indigo-400">
                  Distributor Portal
                </span>
                <span className="rounded-full bg-indigo-500/15 px-2.5 py-0.5 text-[10px] font-bold text-indigo-700 dark:text-indigo-300">
                  Dealer App Credentials
                </span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#14172C] dark:text-white">
                Distributor Sign In
              </h2>
              <p className="text-xs leading-relaxed text-[#64748B] dark:text-slate-400">
                Sign in with your registered dealer email and password to access quota tools.
              </p>
            </div>

            <form onSubmit={submit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dist-email" className="text-xs font-semibold text-foreground">
                  Dealer Account Email
                </Label>
                <Input
                  id="dist-email"
                  type="email"
                  autoComplete="email"
                  placeholder="distributor@shop.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  className={`h-11 rounded-2xl border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 text-foreground placeholder:text-muted-foreground/70 focus-visible:bg-white shadow-xs ${
                    errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""
                  }`}
                />
                {errors.email && <p className="text-[11px] font-medium text-rose-500">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dist-password" className="text-xs font-semibold text-foreground">
                    Password
                  </Label>
                </div>
                <div className="relative">
                  <Input
                    id="dist-password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter account password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    className={`h-11 pr-11 rounded-2xl border-white/90 dark:border-white/15 bg-white/80 dark:bg-white/10 text-foreground placeholder:text-muted-foreground/70 focus-visible:bg-white shadow-xs ${
                      errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] font-medium text-rose-500">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-3 h-11 w-full rounded-2xl bg-[#1E1B4B] hover:bg-[#2A2665] text-white font-semibold text-sm shadow-md transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Signing in…
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Access Portal <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <Link
                to="/login"
                className="text-xs font-semibold text-[#4338CA] hover:underline transition-colors"
              >
                ← Return to Platform Administrator Login
              </Link>
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between text-xs text-muted-foreground px-2">
            <span>© {new Date().getFullYear()} Nexus Platform</span>
            <div className="flex gap-4">
              <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
              <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
