"use client";

import { useState, useEffect } from "react";
import QuizComponent, { type QuizQuestion } from "@/components/QuizComponent";

const ORDER = [
  { slug: "python-pengenalan-quiz", label: "Python — Pengenalan" },
  { slug: "python-variabel-fill", label: "Python — Variabel" },
];

export default function QuizPage() {
  const [index, setIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const item = ORDER[index];

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/exercises/${item.slug}.json`);
        if (res.ok) {
          const json = await res.json();
          setQuestions((json.questions ?? []) as QuizQuestion[]);
        } else {
          setQuestions([]);
        }
      } catch {
        setQuestions([]);
      }
    };
    load();
  }, [item.slug]);

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10">
      <h1 className="text-2xl font-bold">Latihan Interaktif</h1>

      <div className="mt-4 flex flex-wrap gap-2">
        {ORDER.map((o, i) => (
          <button
            key={o.slug}
            type="button"
            onClick={() => setIndex(i)}
            className={`rounded-md px-3 py-1.5 text-xs font-medium transition ${
              i === index ? "bg-primary text-white" : "bg-muted hover:bg-muted/80"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        <QuizComponent data={{ questions }} />
      </div>

      <div className="mt-6 flex gap-2">
        {index > 0 && (
          <button
            type="button"
            onClick={() => setIndex(index - 1)}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            ← Sebelumnya
          </button>
        )}
        {index < ORDER.length - 1 && (
          <button
            type="button"
            onClick={() => setIndex(index + 1)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary/90"
          >
            Berikutnya →
          </button>
        )}
      </div>
    </section>
  );
}
