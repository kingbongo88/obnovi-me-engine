import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { adminListContent, adminSaveContent, adminDeleteContent } from "@/lib/admin.functions";

export const Route = createFileRoute("/admin/sadrzaj")({
  head: () => ({ meta: [{ title: "Site content — Admin" }, { name: "robots", content: "noindex" }] }),
  component: AdminContent,
});

type Row = { key: string; value: string; updated_at: string };

function AdminContent() {
  const list = useServerFn(adminListContent);
  const save = useServerFn(adminSaveContent);
  const del = useServerFn(adminDeleteContent);

  const [rows, setRows] = useState<Row[]>([]);
  const [drafts, setDrafts] = useState<Record<string, string>>({});
  const [savingKey, setSavingKey] = useState<string | null>(null);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [loading, setLoading] = useState(true);

  async function refresh() {
    setLoading(true);
    try {
      const data = (await list()) as Row[];
      setRows(data);
      setDrafts(Object.fromEntries(data.map((r) => [r.key, r.value])));
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { void refresh(); /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, []);

  async function handleSave(key: string) {
    setSavingKey(key);
    try {
      await save({ data: { key, value: drafts[key] ?? "" } });
      await refresh();
    } finally {
      setSavingKey(null);
    }
  }

  async function handleAdd() {
    if (!newKey.trim()) return;
    await save({ data: { key: newKey.trim(), value: newValue } });
    setNewKey("");
    setNewValue("");
    await refresh();
  }

  async function handleDelete(key: string) {
    if (!confirm(`Delete "${key}"?`)) return;
    await del({ data: { key } });
    await refresh();
  }

  return (
    <div>
      <div className="mb-6 flex items-baseline justify-between">
        <h1 className="text-2xl font-semibold">Site content</h1>
        <p className="text-sm text-muted-foreground">Edit the text on the homepage, static pages and FAQ.</p>
      </div>

      {loading ? (
        <p className="text-muted-foreground">Loading…</p>
      ) : (
        <div className="space-y-4">
          {rows.map((r) => {
            const dirty = (drafts[r.key] ?? "") !== r.value;
            const isLong = (r.value?.length ?? 0) > 80 || (drafts[r.key]?.length ?? 0) > 80;
            return (
              <div key={r.key} className="rounded-xl border bg-card p-4">
                <div className="mb-2 flex items-center justify-between gap-2">
                  <code className="text-xs font-medium text-muted-foreground">{r.key}</code>
                  <button
                    onClick={() => handleDelete(r.key)}
                    className="text-xs text-muted-foreground hover:text-destructive"
                  >
                    Delete
                  </button>
                </div>
                {isLong ? (
                  <textarea
                    value={drafts[r.key] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.key]: e.target.value }))}
                    rows={4}
                    className="w-full rounded-md border bg-background p-2 text-sm"
                  />
                ) : (
                  <input
                    value={drafts[r.key] ?? ""}
                    onChange={(e) => setDrafts((d) => ({ ...d, [r.key]: e.target.value }))}
                    className="w-full rounded-md border bg-background p-2 text-sm"
                  />
                )}
                <div className="mt-2 flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">
                    Updated: {new Date(r.updated_at).toLocaleString("en-GB")}
                  </span>
                  <button
                    disabled={!dirty || savingKey === r.key}
                    onClick={() => handleSave(r.key)}
                    className="btn-primary px-4 py-1.5 text-xs disabled:opacity-40"
                  >
                    {savingKey === r.key ? "Saving…" : "Save"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-8 rounded-xl border border-dashed bg-muted/30 p-4">
        <h2 className="mb-3 text-sm font-semibold uppercase tracking-wider text-muted-foreground">New key</h2>
        <div className="grid gap-2 md:grid-cols-[220px_1fr_auto]">
          <input
            placeholder="e.g. home.hero_title"
            value={newKey}
            onChange={(e) => setNewKey(e.target.value)}
            className="rounded-md border bg-background p-2 text-sm"
          />
          <input
            placeholder="Value"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            className="rounded-md border bg-background p-2 text-sm"
          />
          <button onClick={handleAdd} className="btn-primary px-4 py-2 text-sm">Add</button>
        </div>
      </div>
    </div>
  );
}
