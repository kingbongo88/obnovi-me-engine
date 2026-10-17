import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery, useMutation } from "@tanstack/react-query";
import { adminListOrders, adminUpdateOrderStatus } from "@/lib/admin.functions";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/narudzbe")({
  component: OrdersPage,
});

function OrdersPage() {
  const list = useServerFn(adminListOrders);
  const update = useServerFn(adminUpdateOrderStatus);
  const q = useQuery({ queryKey: ["admin","orders"], queryFn: () => list() });
  const m = useMutation({
    mutationFn: (v: { id: string; status: "new"|"confirmed"|"shipped"|"delivered"|"cancelled" }) => update({ data: v }),
    onSuccess: () => { q.refetch(); toast.success("Updated"); },
    onError: (e) => toast.error(e instanceof Error ? e.message : "Error"),
  });

  return (
    <div>
      <h1 className="font-display text-3xl">Orders</h1>
      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead className="bg-[color:var(--surface-2)] text-left text-xs uppercase text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Ref</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Address</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {(q.data ?? []).map((o: Record<string, unknown>) => {
              const snap = o.item_snapshot as { model_name?: string; storage_gb?: number; grade?: string };
              return (
                <tr key={o.id as string} className="border-t border-border">
                  <td className="px-4 py-3 font-mono text-xs">{o.reference_code as string}</td>
                  <td className="px-4 py-3">
                    {snap.model_name} {snap.storage_gb ? (snap.storage_gb >= 1024 ? `${snap.storage_gb / 1024} TB` : snap.storage_gb + "GB") : ""} {snap.grade ? `· ${snap.grade}` : ""}
                  </td>
                  <td className="px-4 py-3 font-medium">{Number(o.total_price)} €</td>
                  <td className="px-4 py-3">
                    <div>{o.customer_name as string}</div>
                    <div className="text-xs text-muted-foreground">{o.customer_phone as string}</div>
                  </td>
                  <td className="px-4 py-3 text-xs">{o.city as string}, {o.address as string}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status as string}
                      onChange={(e) => m.mutate({ id: o.id as string, status: e.target.value as "new"|"confirmed"|"shipped"|"delivered"|"cancelled" })}
                      className="rounded border border-border bg-background px-2 py-1 text-xs"
                    >
                      <option value="new">new</option>
                      <option value="confirmed">confirmed</option>
                      <option value="shipped">shipped</option>
                      <option value="delivered">delivered</option>
                      <option value="cancelled">cancelled</option>
                    </select>
                  </td>
                </tr>
              );
            })}
            {q.data && q.data.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-muted-foreground">No orders yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
