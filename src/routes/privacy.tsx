import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2, ArrowLeft, Shield } from "lucide-react";
import { Logo } from "@/components/nexlock/Logo";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/privacy")({
  head: () => ({
    meta: [
      { title: "Privacy Policy — Nexus" },
      { name: "description", content: "How Nexus collects and uses information from financed devices and dealer accounts." },
    ],
  }),
  component: PrivacyPolicyPage,
});

interface LegalContent {
  title: string;
  lastUpdated: string;
  content: string;
}

function PrivacyPolicyPage() {
  const [doc, setDoc] = useState<LegalContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: LegalContent }>("/legal/privacy-policy")
      .then((res) => setDoc(res.data))
      .catch(() => setError("Couldn't load the privacy policy right now. Please try again shortly."));
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground antialiased selection:bg-primary/20">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-card/85 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
          <Link to="/login" className="flex items-center gap-2">
            <Logo />
          </Link>
          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 rounded-lg border border-border/80 bg-muted/40 px-3 py-1.5 text-xs font-semibold hover:bg-muted transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back to Console
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-6 py-10 animate-fade-up">
        {!doc && !error && (
          <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-sm text-muted-foreground">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
            <span>Loading policy documents…</span>
          </div>
        )}
        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/10 p-6 text-sm text-destructive">
            {error}
          </div>
        )}
        {doc && (
          <article className="rounded-2xl border border-border/80 bg-card p-8 md:p-12 shadow-xs">
            <div className="border-b border-border/80 pb-6 mb-8">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary mb-3">
                <Shield className="h-3.5 w-3.5" /> Compliance & Legal
              </div>
              <h1 className="text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
                {doc.title}
              </h1>
              <p className="mt-2 text-xs font-medium text-muted-foreground">
                Document Revision Date: <span className="text-foreground">{doc.lastUpdated}</span>
              </p>
            </div>
            <div className="whitespace-pre-line text-sm leading-relaxed text-foreground/85 space-y-4">
              {doc.content}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
