import { NextRequest, NextResponse } from "next/server";
import { createWandboxAdapter } from "@/lib/runners/wandbox-adapter";

const MAX_INPUT_LENGTH = 10000;
const MAX_CODE_LENGTH = 50000;
const RATE_LIMIT_WINDOW_MS = 60000;
const MAX_REQUESTS_PER_WINDOW = 10;

const ipTracker = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const times = ipTracker.get(ip) ?? [];
  const recent = times.filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  ipTracker.set(ip, recent);
  return recent.length >= MAX_REQUESTS_PER_WINDOW;
}

export async function POST(request: NextRequest) {
  const clientIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  if (isRateLimited(clientIp)) {
    return NextResponse.json(
      { error: "Terlalu banyak permintaan. Coba lagi dalam 1 menit." },
      { status: 429 },
    );
  }

  try {
    const body = (await request.json()) as { language?: string; code?: string; stdin?: string };

    if (!body.language || typeof body.language !== "string") {
      return NextResponse.json({ error: "Parameter 'language' wajib diisi." }, { status: 400 });
    }

    if (!body.code || typeof body.code !== "string") {
      return NextResponse.json({ error: "Parameter 'code' wajib diisi." }, { status: 400 });
    }

    if (body.code.length > MAX_CODE_LENGTH) {
      return NextResponse.json(
        { error: `Kode terlalu panjang (maksimal ${MAX_CODE_LENGTH} karakter).` },
        { status: 413 },
      );
    }

    if (body.stdin && body.stdin.length > MAX_INPUT_LENGTH) {
      return NextResponse.json(
        { error: `Input terlalu panjang (maksimal ${MAX_INPUT_LENGTH} karakter).` },
        { status: 413 },
      );
    }

    const allowed = ["c", "cpp", "csharp", "php"];
    if (!allowed.includes(body.language.toLowerCase())) {
      return NextResponse.json(
        { error: "Bahasa tidak didukung untuk eksekusi terisolasi." },
        { status: 400 },
      );
    }

    // Catat permintaan
    const now = Date.now();
    const times = ipTracker.get(clientIp) ?? [];
    times.push(now);
    ipTracker.set(clientIp, times);

    // Jalankan melalui adapter Piston (terisolasi) sesuai bahasa
    const adapter = createWandboxAdapter(body.language.toLowerCase());
    const result = await adapter.run(body.code, body.stdin, { timeoutMs: 10000 });

    return NextResponse.json({
      stdout: result.stdout,
      stderr: result.stderr,
      status: result.status,
      timeMs: result.timeMs,
      language: result.language,
    });
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : "Terjadi kesalahan tidak terduga.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
