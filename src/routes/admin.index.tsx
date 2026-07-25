import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  return (
    <div>
      <h1 className="font-display text-3xl">Administracija</h1>
      <p className="mt-2 text-muted-foreground">Izaberi sekciju iz menija.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-sm font-semibold">Prvi koraci</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            <li>Cjenovnik — provjeri i podesi cijene modela.</li>
            <li>Otkupi — pregled dolaznih zahtjeva.</li>
            <li>Inventar — dodaj obnovljene uređaje za prodaju.</li>
            <li>Porudžbine — status kupovina.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
