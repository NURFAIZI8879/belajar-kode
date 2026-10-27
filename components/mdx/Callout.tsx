import type { ReactNode } from "react";

const STYLES = {
  info: "border-sky-400/40 bg-sky-50 text-sky-950 dark:bg-sky-950/30 dark:text-sky-100",
  tip: "border-emerald-400/40 bg-emerald-50 text-emerald-950 dark:bg-emerald-950/30 dark:text-emerald-100",
  warning:
    "border-amber-400/50 bg-amber-50 text-amber-950 dark:bg-amber-950/30 dark:text-amber-100",
} as const;

const TITLES = {
  info: "Info",
  tip: "Tips",
  warning: "Perhatian",
} as const;

export function Callout({
  type = "info",
  title,
  children,
}: {
  type?: keyof typeof STYLES;
  title?: string;
  children: ReactNode;
}) {
  const variant = STYLES[type] ?? STYLES.info;

  return (
    <aside role="note" className={`my-6 rounded-lg border p-4 ${variant}`}>
      <p className="font-semibold">{title ?? TITLES[type] ?? TITLES.info}</p>
      <div className="mt-1 text-sm leading-relaxed [&>p]:m-0">{children}</div>
    </aside>
  );
}
