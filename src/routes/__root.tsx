import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader, SiteFooter } from "@/components/site-header";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <div className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-md text-center">
          <h1 className="font-display text-7xl">404</h1>
          <p className="mt-4 text-lg text-muted-foreground">Stranica nije pronađena.</p>
          <Link to="/" className="btn-primary mt-6">
            Nazad na početnu
          </Link>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">Došlo je do greške</h1>
        <p className="mt-2 text-sm text-muted-foreground">Pokušajte ponovo.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="btn-primary"
          >
            Pokušaj ponovo
          </button>
          <a href="/" className="btn-outline">Početna</a>
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
      { title: "Obnovi.me — Obnovljeni iPhone sa garancijom u Crnoj Gori" },
      {
        name: "description",
        content:
          "Obnovljeni iPhone uređaji sa garancijom. Testirani, čisti, spremni za slanje. Uštedi do 50%.",
      },
      { name: "author", content: "Obnovi.me" },
      { property: "og:title", content: "Obnovi.me — Obnovljeni iPhone sa garancijom u Crnoj Gori" },
      {
        property: "og:description",
        content:
          "Obnovljeni iPhone uređaji sa garancijom. Testirani, čisti, spremni za slanje. Uštedi do 50%.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Obnovi.me — Obnovljeni iPhone sa garancijom u Crnoj Gori" },
      { name: "twitter:description", content: "Obnovljeni iPhone uređaji sa garancijom. Testirani, čisti, spremni za slanje. Uštedi do 50%." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1139c88c-809a-40f6-bd67-b59bff04ba41/id-preview-24837618--f5d18c75-67b1-4f39-8d80-0ae1ca0a4101.lovable.app-1784975985926.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/1139c88c-809a-40f6-bd67-b59bff04ba41/id-preview-24837618--f5d18c75-67b1-4f39-8d80-0ae1ca0a4101.lovable.app-1784975985926.png" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="sr-Latn-ME">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
      <Toaster position="top-right" richColors />
    </QueryClientProvider>
  );
}
