export function Sidebar({ title }: { title?: string }) {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border p-4 md:block">
      <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">
        {title ?? "Daftar Bab"}
      </h2>
      <p className="text-sm text-foreground/60">Sidebar akan diisi otomatis pada Tahap 1.</p>
    </aside>
  );
}
