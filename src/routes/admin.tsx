import { createFileRoute, Outlet, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useServerFn } from "@tanstack/react-start";
import { amIAdmin } from "@/lib/admin.functions";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { me } from "@/i18n/me";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin — Obnovi.me" }, { name: "robots", content: "noindex" }] }),
  component: AdminLayout,
});

function AdminLayout() {
  const nav = useNavigate();
  const checkAdmin = useServerFn(amIAdmin);
  const [state, setState] = useState<"loading" | "no-session" | "not-admin" | "ok">("loading");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        if (!cancelled) setState("no-session");
        return;
      }
      try {
        const r = await checkAdmin();
        if (cancelled) return;
        setState(r.isAdmin ? "ok" : "not-admin");
      } catch {
        if (!cancelled) setState("not-admin");
      }
    })();
    return () => { cancelled = true; };
  }, [checkAdmin]);

  if (state === "loading") {
    return <div className="min-h-screen"><SiteHeader /><main className="container-narrow py-24 text-center text-muted-foreground">{me.common.loading}</main></div>;
  }
  if (state === "no-session") {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container-narrow py-24 text-center">
          <p className="text-muted-foreground">Potrebna je prijava.</p>
          <Link to="/auth" className="btn-primary mt-4">Prijava</Link>
        </main>
      </div>
    );
  }
  if (state === "not-admin") {
    return (
      <div className="min-h-screen">
        <SiteHeader />
        <main className="container-narrow py-24 text-center">
          <p className="text-muted-foreground">{me.admin.notAuthorized}</p>
          <button onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }} className="btn-outline mt-4">
            {me.admin.signOut}
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="container-narrow flex gap-8 py-8">
        <aside className="w-56 shrink-0">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wider text-muted-foreground">{me.admin.title}</h2>
          <nav className="space-y-1 text-sm">
            <AdminLink to="/admin" label="Pregled" />
            <AdminLink to="/admin/otkupi" label={me.admin.submissions} />
            <AdminLink to="/admin/inventar" label={me.admin.inventory} />
            <AdminLink to="/admin/narudzbe" label={me.admin.orders} />
            <AdminLink to="/admin/cjenovnik" label={me.admin.pricing} />
          </nav>
          <button
            onClick={async () => { await supabase.auth.signOut(); nav({ to: "/auth" }); }}
            className="mt-6 text-xs text-muted-foreground hover:text-foreground"
          >
            {me.admin.signOut}
          </button>
        </aside>
        <main className="min-w-0 flex-1">
          <Outlet />
        </main>
      </div>
      <SiteFooter />
    </div>
  );
}

function AdminLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      activeOptions={{ exact: true }}
      className="block rounded-lg px-3 py-2 text-muted-foreground hover:bg-accent hover:text-foreground"
      activeProps={{ className: "bg-accent text-foreground font-medium" }}
    >
      {label}
    </Link>
  );
}
