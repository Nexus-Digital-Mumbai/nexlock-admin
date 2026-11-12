import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { Logo } from "@/components/nexlock/Logo";
import { apiClient } from "@/lib/api-client";

export const Route = createFileRoute("/terms")({
  head: () => ({
    meta: [
      { title: "Terms & Conditions — NexLock" },
      { name: "description", content: "The terms that apply to devices enrolled in the NexLock Device Protection Program and to dealer accounts." },
    ],
  }),
  component: TermsPage,
});

interface LegalContent {
  title: string;
  lastUpdated: string;
  content: string;
}

function TermsPage() {
  const [doc, setDoc] = useState<LegalContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiClient
      .get<{ success: boolean; data: LegalContent }>("/legal/terms")
      .then((res) => setDoc(res.data))
      .catch(() => setError("Couldn't load the terms right now. Please try again shortly."));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-5">
          <Link to="/login"><Logo /></Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-12">
        {!doc && !error && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" /> Loading…
          </div>
        )}
        {error && <p className="text-sm text-destructive">{error}</p>}
        {doc && (
          <article>
            <h1 className="text-3xl font-semibold tracking-tight text-foreground">{doc.title}</h1>
            <p className="mt-1.5 text-sm text-muted-foreground">Last updated: {doc.lastUpdated}</p>
            <div className="mt-8 whitespace-pre-line text-sm leading-relaxed text-foreground/90">
              {doc.content}
            </div>
          </article>
        )}
      </main>
    </div>
  );
}
