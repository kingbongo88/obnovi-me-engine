import { Link } from "@tanstack/react-router";
import { ShoppingBag } from "lucide-react";
import { me } from "@/i18n/me";
import { useCart } from "@/lib/cart";

export function Logo({ size = "md", tone = "dark" }: { size?: "sm" | "md" | "lg"; tone?: "dark" | "light" }) {
  const sz = size === "lg" ? "text-2xl" : size === "sm" ? "text-base" : "text-xl";
  const base = tone === "light" ? "text-white" : "text-[color:var(--foreground)]";
  return (
    <span className={`font-display font-extrabold tracking-tight ${sz} ${base}`}>
      <span>obnovi</span>
      <span className="font-semibold text-[color:var(--accent-brand)]">.me</span>
    </span>
  );
}

export function SiteHeader() {
  const count = useCart((s) => s.items.length);
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        <Link to="/" className="flex items-baseline gap-1">
          <Logo size="md" />
        </Link>
        <nav className="hidden items-center gap-7 text-sm font-medium text-muted-foreground md:flex">
          <Link to="/kupi" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            {me.nav.shop}
          </Link>
          <Link to="/prodaj" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            {me.nav.sell}
          </Link>
          <Link to="/kako-radi" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            {me.nav.how}
          </Link>
          <Link to="/pitanja" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            {me.nav.faq}
          </Link>
          <Link to="/kontakt" className="hover:text-foreground" activeProps={{ className: "text-foreground" }}>
            {me.nav.contact}
          </Link>
        </nav>
        <Link
          to="/kosarica"
          aria-label="Korpa"
          className="relative inline-flex h-9 items-center gap-2 rounded-full border border-border px-3 text-sm font-medium hover:border-[color:var(--accent-brand)]"
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="hidden sm:inline">Korpa</span>
          {count > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[color:var(--accent-brand)] px-1 text-[11px] font-semibold text-white">
              {count}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border bg-[color:var(--surface-2)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-12 md:grid-cols-4">
        <div>
          <Logo size="md" />
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">{me.tagline}</p>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Prodaja</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/prodaj" className="hover:text-foreground">{me.nav.sell}</Link></li>
            <li><Link to="/kako-radi" className="hover:text-foreground">{me.nav.how}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Kupovina</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li><Link to="/kupi" className="hover:text-foreground">{me.nav.shop}</Link></li>
            <li><Link to="/pitanja" className="hover:text-foreground">{me.nav.faq}</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="text-sm font-semibold">Kontakt</h4>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{me.contact.email}</li>
            <li>{me.contact.phone}</li>
            <li>{me.contact.cities}</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border py-6 text-center text-xs text-muted-foreground">
        © {new Date().getFullYear()} Obnovi.me · Podgorica, Crna Gora
      </div>
    </footer>
  );
}
