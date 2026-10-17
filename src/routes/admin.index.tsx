import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/")({
  component: AdminHome,
});

function AdminHome() {
  return (
    <div>
      <h1 className="font-display text-3xl">Admin dashboard</h1>
      <p className="mt-2 text-muted-foreground">Choose a section from the menu.</p>
      <div className="mt-6 grid gap-3 md:grid-cols-2">
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="text-sm font-semibold">Getting started</div>
          <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-muted-foreground">
            <li>Pricing — review and adjust model prices.</li>
            <li>Trade-ins — review incoming requests.</li>
            <li>Inventory — add refurbished phones for sale.</li>
            <li>Orders — track purchase status.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
