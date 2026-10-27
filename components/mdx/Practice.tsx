export function Practice({ question, answer }: { question: string; answer: string }) {
  return (
    <section className="my-6 rounded-lg border border-border bg-muted/30 p-4">
      <h2 className="text-base font-semibold">Latihan singkat</h2>
      <p className="mt-2 text-sm leading-relaxed">{question}</p>
      <details className="mt-3">
        <summary className="cursor-pointer text-sm font-medium text-primary">Lihat jawaban</summary>
        <p className="mt-2 rounded-md border border-border bg-background p-3 text-sm leading-relaxed">
          {answer}
        </p>
      </details>
    </section>
  );
}
