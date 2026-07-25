import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminListSubmissions, adminUpdateSubmissionStatus } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/otkupi")({
  component: SubmissionsPage,
});

function SubmissionsPage() {
  const list = useServerFn(adminListSubmissions);
  const update = useServerFn(adminUpdateSubmissionStatus);
  const q = useQuery({ queryKey: ["admin","submissions"], queryFn: () => list() });
  const m = useMutation({
    mutationFn: (v: { id: string; status: "pending"|"accepted"|"rejected"|"completed"|"cancelled" }) => update({ data: v }),
    onSuccess: () => { q.refetch(); toast.success("Ažurirano"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Greška"),
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Otkupi</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--surface-2)] text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Model</th>
              <th className="px-4 py-3">Memorija</th>
              <th className="px-4 py-3">Bat.</th>
              <th className="px-4 py-3">Stanje</th>
              <th className="px-4 py-3">Ponuda</th>
              <th className="px-4 py-3">Kontakt</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Akcije</th>
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((s: Record<string, unknown>) => (
              <tr key={s.id as string} className="border-t border-border">
                <td className="px-4 py-3 font-mono text-xs">{s.reference_code as string}</td>
                <td className="px-4 py-3">{s.model_name as string}</td>
                <td className="px-4 py-3">{(s.storage_gb as number) >= 1024 ? "1TB" : `${s.storage_gb}GB`}</td>
                <td className="px-4 py-3">{s.battery_health as number}%</td>
                <td className="px-4 py-3">{(s.effective_grade as string) ?? "—"}</td>
                <td className="px-4 py-3 font-medium">
                  {s.calculated_payout ? `${Number(s.calculated_payout)} €` : <span className="text-destructive">{s.rejection_reason as string}</span>}
                </td>
                <td className="px-4 py-3">
                  <div>{s.customer_name as string}</div>
                  <div className="text-xs text-muted-foreground">{s.customer_phone as string}</div>
                </td>
                <td className="px-4 py-3">
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs">{s.status as string}</span>
                </td>
                <td className="px-4 py-3">
                  <select
                    value={s.status as string}
                    onChange={(e) => m.mutate({ id: s.id as string, status: e.target.value as "pending"|"accepted"|"rejected"|"completed"|"cancelled" })}
                    className="rounded border border-border bg-background px-2 py-1 text-xs"
                  >
                    <option value="pending">pending</option>
                    <option value="accepted">accepted</option>
                    <option value="rejected">rejected</option>
                    <option value="completed">completed</option>
                    <option value="cancelled">cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
            {q.data && q.data.length === 0 && (
              <tr><td colSpan={9} className="px-4 py-8 text-center text-muted-foreground">Nema zahtjeva.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
