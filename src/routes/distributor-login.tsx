import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Network, ShieldCheck, ArrowRight, Layers, Smartphone } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Logo } from "@/components/nexlock/Logo";
import { ThemeToggle } from "@/components/nexlock/ThemeToggle";
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
      {/* Top Header Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 py-12 lg:grid-cols-12 lg:px-12">
        {/* Left Information Panel */}
        <div className="hidden lg:col-span-7 lg:block space-y-7 animate-fade-up">
          <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-[#0755D8] dark:text-[#00D4FF] shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-[#008CFF] dark:bg-[#00D4FF] animate-pulse" />
            Nexus Distributor & Quota Ecosystem
          </div>

          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Logo size="xl" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#071B5E] dark:text-[#F5F8FF] sm:text-5xl lg:text-[46px] leading-[1.18]">
              Manage Quota Pools & Sub-Dealer Networks.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#4B6188] dark:text-[#8CA5C8]">
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
                className="card-interactive rounded-2xl p-4.5"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#0755D8]/10 dark:bg-[#006BFF]/15 text-[#0755D8] dark:text-[#00D4FF] border border-[#0755D8]/20 dark:border-[#006BFF]/30 mb-2.5">
                  <f.icon className="h-4.5 w-4.5" />
                </div>
                <h2 className="text-sm font-bold text-[#071B5E] dark:text-[#F5F8FF]">{f.title}</h2>
                <p className="mt-1 text-xs text-[#4B6188] dark:text-[#8CA5C8] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Distributor Login Card */}
        <div className="mx-auto w-full max-w-md lg:col-span-5 animate-fade-up">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo size="lg" />
          </div>

          <div className="card-elevated rounded-3xl p-8 sm:p-9 shadow-[0_20px_50px_rgba(7,27,94,0.08)] dark:shadow-[0_20px_50px_rgba(2,11,28,0.85)]">
            <div className="mb-6 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-slate-200 dark:border-[#164675] bg-slate-50 dark:bg-[#061329] p-1.5 shadow-xs">
                  <img src="/nexus-icon.png" alt="Nexus" className="h-full w-full object-contain" />
                </div>
                <span className="rounded-full bg-[#0755D8]/15 dark:bg-[#006BFF]/20 border border-[#0755D8]/30 dark:border-[#006BFF]/35 px-2.5 py-0.5 text-[10px] font-bold text-[#0755D8] dark:text-[#00D4FF]">
                  Dealer App Credentials
                </span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#071B5E] dark:text-[#F5F8FF]">
                Distributor Sign In
              </h2>
              <p className="text-xs leading-relaxed text-[#4B6188] dark:text-[#8CA5C8]">
                Sign in with your registered dealer email and password to access quota tools.
              </p>
            </div>

            <form onSubmit={submit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="dist-email" className="text-xs font-semibold text-[#071B5E] dark:text-[#F5F8FF]">
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
                  className={`h-11 rounded-2xl border-slate-200 dark:border-[#164675] bg-white/90 dark:bg-[#061329]/80 text-[#071B5E] dark:text-[#F5F8FF] placeholder:text-slate-400 dark:placeholder:text-[#8CA5C8]/60 focus-visible:bg-white dark:focus-visible:bg-[#061329] focus-visible:border-[#0755D8] dark:focus-visible:border-[#00D4FF] focus-visible:ring-[#0755D8]/20 dark:focus-visible:ring-[#00D4FF]/25 shadow-xs ${
                    errors.email ? "border-rose-500 focus-visible:ring-rose-500" : ""
                  }`}
                />
                {errors.email && <p className="text-[11px] font-medium text-rose-500 dark:text-rose-400">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="dist-password" className="text-xs font-semibold text-[#071B5E] dark:text-[#F5F8FF]">
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
                    className={`h-11 pr-11 rounded-2xl border-slate-200 dark:border-[#164675] bg-white/90 dark:bg-[#061329]/80 text-[#071B5E] dark:text-[#F5F8FF] placeholder:text-slate-400 dark:placeholder:text-[#8CA5C8]/60 focus-visible:bg-white dark:focus-visible:bg-[#061329] focus-visible:border-[#0755D8] dark:focus-visible:border-[#00D4FF] focus-visible:ring-[#0755D8]/20 dark:focus-visible:ring-[#00D4FF]/25 shadow-xs ${
                      errors.password ? "border-rose-500 focus-visible:ring-rose-500" : ""
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-slate-400 dark:text-[#8CA5C8] hover:text-[#071B5E] dark:hover:text-[#F5F8FF] cursor-pointer"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-[11px] font-medium text-rose-500 dark:text-rose-400">{errors.password}</p>}
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-3 h-11 w-full rounded-2xl bg-[#0755D8] hover:bg-[#008CFF] dark:bg-[#006BFF] dark:hover:bg-[#00D4FF] dark:hover:text-[#020B1C] text-white font-semibold text-sm shadow-[0_0_20px_rgba(7,85,216,0.25)] dark:shadow-[0_0_20px_rgba(0,107,255,0.35)] transition-all cursor-pointer"
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
                className="text-xs font-semibold text-[#0755D8] dark:text-[#00D4FF] hover:underline transition-colors"
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
