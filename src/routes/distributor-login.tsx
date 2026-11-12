import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Eye, EyeOff, Loader2, Network, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "@/components/nexlock/Logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { apiClient } from "@/lib/api-client";
import { session } from "@/lib/session";

export const Route = createFileRoute("/distributor-login")({
  head: () => ({
    meta: [
      { title: "Distributor Sign In — NexLock Admin" },
      { name: "description", content: "Sign in to manage your quota pool and connector dealers." },
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

    // Same login credentials as the mobile Dealer app — a distributor is just a dealer with
    // extra capabilities, not a separate account system (see dealer-staff.service.ts#login).
    apiClient.post("/dealer-staff/login", { email, password })
      .then((data) => {
        if (data.success) {
          session.setAccessToken(data.data.accessToken);
          session.setUser(data.data.staff);
          session.broadcastLogin();
          toast.success("Login successful", { description: "Welcome back." });
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
    <div className="min-h-screen w-full bg-gradient-to-br from-[#07152C] via-[#0b1f3d] to-[#07152C] text-foreground">
      <div className="mx-auto grid min-h-screen w-full max-w-6xl grid-cols-1 items-center gap-10 px-6 py-10 lg:grid-cols-2">
        <div className="hidden text-white/90 lg:block animate-fade-up">
          <Logo />
          <h1 className="mt-10 text-4xl font-semibold leading-tight tracking-tight text-white">
            Manage your quota pool and connector dealers.
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-white/60">
            Allocate device-enrollment capacity to the dealers under you, and enroll your own
            devices, all from one place.
          </p>
          <div className="mt-10 grid max-w-md gap-4 text-sm text-white/70">
            <div className="flex items-start gap-3 rounded-lg border border-white/10 bg-white/5 p-4 backdrop-blur">
              <Network className="mt-0.5 h-5 w-5 text-primary" />
              <div>
                <div className="text-sm font-semibold text-white">Distributor Portal</div>
                <div className="text-xs text-white/60">Uses the same login as your Dealer app.</div>
              </div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md animate-fade-up">
          <div className="mb-6 flex justify-center lg:hidden">
            <Logo />
          </div>
          <div className="rounded-2xl border border-border bg-card p-8 shadow-2xl">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold tracking-tight text-foreground">Distributor Sign In</h2>
              <p className="mt-1.5 text-sm text-muted-foreground">
                Use your Dealer app login credentials to continue.
              </p>
            </div>

            <form onSubmit={submit} noValidate className="space-y-4">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@dealer.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!errors.email}
                  className={errors.email ? "border-destructive focus-visible:ring-destructive" : ""}
                />
                {errors.email && <p className="text-xs font-medium text-destructive">{errors.email}</p>}
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPw ? "text" : "password"}
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    aria-invalid={!!errors.password}
                    className={`pr-10 ${errors.password ? "border-destructive focus-visible:ring-destructive" : ""}`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md p-1.5 text-muted-foreground hover:bg-muted"
                    aria-label={showPw ? "Hide password" : "Show password"}
                  >
                    {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="text-xs font-medium text-destructive">{errors.password}</p>}
              </div>

              <Button type="submit" disabled={loading} className="mt-2 h-11 w-full text-sm font-semibold">
                {loading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Verifying…</>
                ) : (
                  "Sign in"
                )}
              </Button>
            </form>

            <div className="mt-6 flex items-center justify-center gap-2 rounded-lg border border-border bg-muted/40 px-3 py-2.5 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4 text-primary" />
              Not a distributor? <Link to="/login" className="font-medium text-primary hover:underline">Admin sign in</Link>
            </div>
          </div>

          <p className="mt-6 text-center text-xs text-white/50">
            © {new Date().getFullYear()} NexLock Technologies.
          </p>
        </div>
      </div>
    </div>
  );
}
