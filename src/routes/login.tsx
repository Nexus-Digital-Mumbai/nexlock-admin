import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Lock, ShieldCheck, Smartphone, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Logo } from "@/components/nexlock/Logo";
import { ThemeToggle } from "@/components/nexlock/ThemeToggle";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Sign in — Nexus Admin Console" },
      { name: "description", content: "Secure administrator sign in for the Nexus enterprise device financing and lock management console." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (session.isAuthenticated()) {
      navigate({ to: "/" });
    }
  }, [navigate]);

  const validate = () => {
    const e: { email?: string; password?: string } = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Enter a valid email address";
    if (!password) e.password = "Password is required";
    else if (password.length < 6) e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const submit = (ev: React.FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    setLoading(true);

    apiClient
      .post("/auth/login", { email, password, rememberMe: remember })
      .then((data) => {
        if (data.success) {
          session.setAccessToken(data.data.accessToken);
          session.setUser(data.data.user);
          session.broadcastLogin();
          toast.success("Login successful", { description: "Welcome to Nexus Console." });
          navigate({ to: "/" });
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
        {/* Left Hero Panel */}
        <div className="hidden lg:col-span-7 lg:block space-y-7 animate-fade-up">
          <div className="glass-pill inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold text-[#0755D8] dark:text-[#00D4FF] shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            Zero-Trust Device Financing Infrastructure
          </div>

          <div className="space-y-4">
            <div className="flex items-center mb-2">
              <Logo size="xl" />
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-[#071B5E] dark:text-[#F5F8FF] sm:text-5xl lg:text-[46px] leading-[1.18]">
              Intelligent Remote Lock & Device Financing Platform.
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-[#4B6188] dark:text-[#8CA5C8]">
              Complete command center for Android & iOS hardware financing. Manage dealer quotas, enforce remote policy locks, oversee EMI recovery, and safeguard high-value assets in real-time.
            </p>
          </div>

          <div className="grid max-w-xl grid-cols-2 gap-4 pt-2">
            {[
              {
                title: "Remote Policy Engine",
                desc: "Instant lock, alarm, offline hold and wallpaper overlay enforcement.",
                icon: Lock,
              },
              {
                title: "High-Volume Telemetry",
                desc: "Active heartbeat tracking, SIM swap defense, and battery telemetry.",
                icon: Smartphone,
              },
              {
                title: "SOC 2 & ISO Aligned",
                desc: "Granular RBAC, audit logging, and tamper-resistant credentials.",
                icon: ShieldCheck,
              },
              {
                title: "Automated Collections",
                desc: "Dynamic EMI grace periods and distributor quota pooling.",
                icon: Zap,
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

          <div className="flex items-center gap-6 pt-2 text-xs text-[#4B6188] dark:text-[#8CA5C8] font-medium">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>99.98% Gateway Uptime</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              <span>End-to-End Encrypted</span>
            </div>
          </div>
        </div>

        {/* Right Authentication Card */}
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
                <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                  System Operational
                </span>
              </div>
              <h2 className="text-2xl font-extrabold tracking-tight text-[#071B5E] dark:text-[#F5F8FF]">
                Console Sign In
              </h2>
              <p className="text-xs leading-relaxed text-[#4B6188] dark:text-[#8CA5C8]">
                Enter your administrative credentials to access the Nexus management dashboard.
              </p>
            </div>

            <form onSubmit={submit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-xs font-semibold text-[#071B5E] dark:text-[#F5F8FF]">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="admin@nexus.io"
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
                  <Label htmlFor="password" className="text-xs font-semibold text-[#071B5E] dark:text-[#F5F8FF]">
                    Password
                  </Label>
                  <Link to="/login" className="text-xs font-medium text-[#0755D8] dark:text-[#00D4FF] hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter security key"
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

              <div className="flex items-center gap-2 pt-1">
                <Checkbox
                  id="remember"
                  checked={remember}
                  onCheckedChange={(v) => setRemember(!!v)}
                  className="rounded-md border-slate-300 dark:border-[#164675] data-[state=checked]:bg-[#0755D8] dark:data-[state=checked]:bg-[#006BFF] data-[state=checked]:border-[#0755D8] dark:data-[state=checked]:border-[#006BFF]"
                />
                <Label htmlFor="remember" className="cursor-pointer text-xs font-normal text-[#4B6188] dark:text-[#8CA5C8]">
                  Trust this workstation for 30 days
                </Label>
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="mt-2 h-11 w-full rounded-2xl bg-[#0755D8] hover:bg-[#008CFF] dark:bg-[#006BFF] dark:hover:bg-[#00D4FF] dark:hover:text-[#020B1C] text-white font-semibold text-sm shadow-[0_0_20px_rgba(7,85,216,0.25)] dark:shadow-[0_0_20px_rgba(0,107,255,0.35)] transition-all cursor-pointer"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Authenticating…
                  </>
                ) : (
                  <span className="inline-flex items-center gap-2">
                    Sign in to Nexus <ArrowRight className="h-4 w-4" />
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-2xl border border-slate-200/80 dark:border-[#164675]/80 bg-slate-100/60 dark:bg-[#061329]/60 px-3.5 py-2.5 text-xs text-[#4B6188] dark:text-[#8CA5C8]">
              <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" />
              <span>Multi-Factor Authentication & Audit Logging Active</span>
            </div>

            <div className="mt-5 text-center">
              <Link
                to="/distributor-login"
                className="text-xs font-semibold text-[#0755D8] dark:text-[#00D4FF] hover:underline transition-colors"
              >
                Distributor / Dealer App Login →
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
