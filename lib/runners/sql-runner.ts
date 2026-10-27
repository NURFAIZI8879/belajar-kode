import type { RunnerAdapter, RunResult } from "./runner";
import initSqlJs from "sql.js";

type SqlDatabase = {
  exec(sql: string): void;
  prepare(sql: string): SqlStatement;
  close(): void;
};

type SqlStatement = {
  getColumnNames(): string[];
  step(): boolean;
  getAsObject(): Record<string, unknown>;
  free(): void;
};

let SQL: { Database: new () => SqlDatabase } | null = null;
let sqlReady: Promise<void> | null = null;

async function ensureSqlReady(): Promise<void> {
  if (sqlReady) {
    return sqlReady;
  }

  sqlReady = (async () => {
    const init = (await initSqlJs({
      locateFile: (file: string) => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`,
    })) as { Database: new () => SqlDatabase };
    SQL = init;
  })();

  return sqlReady;
}

const SAMPLE_SCHEMA = `
CREATE TABLE IF NOT EXISTS Customers (
  id INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  kota TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS Products (
  id INTEGER PRIMARY KEY,
  nama TEXT NOT NULL,
  harga INTEGER NOT NULL
);
CREATE TABLE IF NOT EXISTS Orders (
  id INTEGER PRIMARY KEY,
  customer_id INTEGER,
  product_id INTEGER,
  jumlah INTEGER,
  FOREIGN KEY (customer_id) REFERENCES Customers(id),
  FOREIGN KEY (product_id) REFERENCES Products(id)
);

INSERT INTO Customers (nama, kota) VALUES
  ('Sari', 'Bandung'),
  ('Budi', 'Jakarta'),
  ('Rani', 'Surabaya');
INSERT INTO Products (nama, harga) VALUES
  ('Laptop', 12000000),
  ('Mouse', 150000),
  ('Keyboard', 300000);
INSERT INTO Orders (customer_id, product_id, jumlah) VALUES
  (1, 1, 1),
  (2, 2, 2),
  (3, 3, 1);
`;

function formatRows(columns: string[], rows: unknown[][]): string {
  if (rows.length === 0) {
    return "(kosong)";
  }

  const colWidths = columns.map((col, i) =>
    Math.max(col.length, ...rows.map((row) => String(row[i] ?? "").length)),
  );

  const header = columns.map((col, i) => col.padEnd(colWidths[i])).join(" | ");
  const separator = colWidths.map((w) => "-".repeat(w)).join("-+-");
  const body = rows
    .map((row) => row.map((cell, i) => String(cell ?? "").padEnd(colWidths[i])).join(" | "))
    .join("\n");

  return `${header}\n${separator}\n${body}`;
}

export const sqlAdapter: RunnerAdapter = {
  name: "sql.js (SQLite WASM)",

  async isAvailable() {
    try {
      await ensureSqlReady();
      return true;
    } catch {
      return false;
    }
  },

  async run(code: string): Promise<RunResult> {
    const start = performance.now();

    try {
      await ensureSqlReady();

      if (!SQL) {
        throw new Error("SQL belum siap.");
      }

      const db = new SQL.Database();
      db.exec(SAMPLE_SCHEMA);

      const trimmed = code.trim();
      if (!trimmed) {
        return {
          stdout: "",
          stderr: "Masukkan perintah SQL terlebih dahulu.",
          status: "error",
          timeMs: Math.max(0, performance.now() - start),
          language: "sql",
        };
      }

      try {
        const stmt = db.prepare(trimmed);
        const columns = stmt.getColumnNames();
        const rows: unknown[][] = [];
        while (stmt.step()) {
          const obj = stmt.getAsObject();
          rows.push(columns.map((c) => obj[c]));
        }
        stmt.free();

        const output = formatRows(columns, rows);
        db.close();

        return {
          stdout: output,
          stderr: "",
          status: "ok",
          timeMs: Math.max(0, performance.now() - start),
          language: "sql",
        };
      } catch {
        try {
          db.exec(trimmed);
          db.close();
          return {
            stdout: "Perintah SQL dieksekusi berhasil.",
            stderr: "",
            status: "ok",
            timeMs: Math.max(0, performance.now() - start),
            language: "sql",
          };
        } catch (execError: unknown) {
          db.close();
          return {
            stdout: "",
            stderr: execError instanceof Error ? execError.message : String(execError),
            status: "error",
            timeMs: Math.max(0, performance.now() - start),
            language: "sql",
          };
        }
      }
    } catch (error: unknown) {
      return {
        stdout: "",
        stderr: error instanceof Error ? error.message : "Gagal menjalankan SQL.",
        status: "error",
        timeMs: Math.max(0, performance.now() - start),
        language: "sql",
      };
    }
  },
};
