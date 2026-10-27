import { Sidebar } from "@/components/Sidebar";

export default function LangLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto flex w-full max-w-7xl flex-1">
      <Sidebar />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
