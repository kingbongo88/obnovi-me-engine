import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { toast } from "sonner";

export const Route = createFileRoute("/auth")({
  head: () => ({ meta: [{ title: "Prijava — Obnovi.me" }, { name: "robots", content: "noindex" }] }),
  component: AuthPage,
});

function AuthPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"in" | "up">("in");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (data.session) nav({ to: "/admin" });
    });
  }, [nav]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "in") {
        const { error } = await supabase.auth.signInWithPassword({ email, password: pw });
        if (error) throw error;
        nav({ to: "/admin" });
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password: pw,
          options: { emailRedirectTo: window.location.origin },
        });
        if (error) throw error;
        toast.success("Provjeri email za potvrdu.");
      }
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Greška");
    } finally {
      setLoading(false);
    }
  };

  const google = async () => {
    setLoading(true);
    const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (r.error) toast.error("Google prijava nije uspjela");
    if (!r.error && !r.redirected) nav({ to: "/admin" });
    setLoading(false);
  };

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <main className="container-narrow py-16">
        <div className="mx-auto max-w-sm rounded-3xl border border-border bg-card p-8">
          <h1 className="font-display text-3xl">{mode === "in" ? "Prijava" : "Registracija"}</h1>
          <form onSubmit={submit} className="mt-6 space-y-3">
            <input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent-brand)]" />
            <input required type="password" value={pw} onChange={(e) => setPw(e.target.value)} placeholder="Lozinka" minLength={6}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-[color:var(--accent-brand)]" />
            <button disabled={loading} className="btn-primary w-full disabled:opacity-40">{mode === "in" ? "Prijavi se" : "Registruj se"}</button>
          </form>
          <div className="relative my-4 text-center text-xs text-muted-foreground">
            <span className="relative z-10 bg-card px-2">ili</span>
            <span className="absolute inset-x-0 top-1/2 h-px bg-border" />
          </div>
          <button onClick={google} disabled={loading} className="btn-outline w-full disabled:opacity-40">
            Prijava sa Google
          </button>
          <button onClick={() => setMode(mode === "in" ? "up" : "in")} className="mt-4 w-full text-center text-sm text-muted-foreground hover:text-foreground">
            {mode === "in" ? "Nemaš nalog? Registruj se" : "Imaš nalog? Prijavi se"}
          </button>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
