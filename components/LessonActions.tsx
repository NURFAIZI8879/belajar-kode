"use client";

import { useState } from "react";
import { markLessonComplete } from "@/lib/progress";

export function LessonActions({ lang, slug }: { lang: string; slug: string }) {
  const [done, setDone] = useState(false);

  return (
    <div className="mt-6 flex gap-2">
      <button
        type="button"
        onClick={() => {
          markLessonComplete(lang, slug);
          setDone(true);
        }}
        disabled={done}
        className={`rounded-md px-4 py-2 text-sm font-semibold transition ${
          done ? "bg-emerald-600 text-white" : "bg-primary text-white hover:bg-primary/90"
        }`}
      >
        {done ? "✓ Selesai" : "Tandai selesai"}
      </button>
    </div>
  );
}
