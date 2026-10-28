"use client";

import { useState } from "react";

export type QuizQuestion = {
  id: string;
  type: "multiple_choice" | "fill_in_blank";
  text: string;
  options?: string[];
  correctIndex?: number;
  answer?: string;
  explanation?: string;
  hint?: string;
};

export default function QuizComponent({ data }: { data: { questions: QuizQuestion[] } }) {
  const [answers, setAnswers] = useState<Record<string, number | string>>({});
  const [showResult, setShowResult] = useState(false);

  const score = data.questions.reduce((acc, q) => {
    const user = answers[q.id];
    if (q.type === "multiple_choice") {
      return acc + (user === q.correctIndex ? 1 : 0);
    }
    if (q.type === "fill_in_blank") {
      return (
        acc +
        (String(user ?? "")
          .trim()
          .toLowerCase() === (q.answer ?? "").trim().toLowerCase()
          ? 1
          : 0)
      );
    }
    return acc;
  }, 0);

  return (
    <section className="my-8 rounded-xl border border-border bg-muted/30 p-5">
      <h2 className="text-lg font-bold">Kuis Pilihan Ganda</h2>
      <p className="mt-1 text-sm text-foreground/60">
        Pilih jawaban yang benar untuk setiap pertanyaan.
      </p>

      <form
        className="mt-5 space-y-6"
        onSubmit={(e) => {
          e.preventDefault();
          setShowResult(true);
        }}
      >
        {data.questions.map((q) => (
          <div key={q.id} className="rounded-lg border border-border bg-background p-4">
            <p className="font-medium">{q.text}</p>

            {q.type === "multiple_choice" && q.options && (
              <div className="mt-3 space-y-2">
                {q.options.map((opt, i) => (
                  <label key={i} className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="radio"
                      name={q.id}
                      value={i}
                      checked={answers[q.id] === i}
                      onChange={() => setAnswers({ ...answers, [q.id]: i })}
                      className="accent-primary"
                      disabled={showResult}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            )}

            {q.type === "fill_in_blank" && (
              <div className="mt-3">
                <input
                  type="text"
                  value={String(answers[q.id] ?? "")}
                  onChange={(e) => setAnswers({ ...answers, [q.id]: e.target.value })}
                  disabled={showResult}
                  className="w-full rounded-md border border-border px-3 py-2 text-sm focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={q.hint ?? "Tulis jawaban..."}
                />
              </div>
            )}

            {showResult && (
              <div className="mt-3 rounded-md border border-border bg-muted/50 p-3 text-sm leading-relaxed">
                <p className="font-semibold">Penjelasan jawaban</p>
                <p className="mt-1">{q.explanation}</p>
              </div>
            )}
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={showResult}
            className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90 disabled:opacity-50"
          >
            Periksa jawaban
          </button>
          <span className="text-sm text-foreground/60">
            {data.questions.length} pertanyaan — skor: {score} / {data.questions.length}
          </span>
        </div>
      </form>
    </section>
  );
}
