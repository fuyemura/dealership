import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { consultarPlaca, PLACA_REGEX } from "@/lib/utils/placa";

// Proxy server-side para consulta de dados de veículo por placa.
// Para trocar de provedor, edite apenas src/lib/utils/placa.ts.
// Configure a variável de ambiente PLACA_API_TOKEN para habilitar a integração.

const PLACA_API_TOKEN = process.env.PLACA_API_TOKEN ?? process.env.WDAPI_TOKEN;

// ─── Rate limiting em memória ─────────────────────────────────────────────────
// Máx. 60 requisições por usuário por hora. Adequado para instâncias únicas
// (serverless com execução longa). Para múltiplas instâncias, use Redis/Upstash.
const MAX_REQ_POR_HORA = 60;
const JANELA_MS = 60 * 60 * 1000; // 1 hora

const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

function verificarRateLimit(userId: string): boolean {
  const agora = Date.now();
  const entry = rateLimitMap.get(userId);
  if (!entry || agora >= entry.resetAt) {
    rateLimitMap.set(userId, { count: 1, resetAt: agora + JANELA_MS });
    return true;
  }
  if (entry.count >= MAX_REQ_POR_HORA) return false;
  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Garante que apenas usuários autenticados utilizam este endpoint
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
  }

  if (!verificarRateLimit(user.id)) {
    return NextResponse.json(
      { error: "Limite de consultas atingido. Tente novamente em 1 hora." },
      { status: 429 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Requisição inválida." }, { status: 400 });
  }

  if (!body || typeof body !== "object" || !("placa" in body)) {
    return NextResponse.json({ error: "Placa não informada." }, { status: 400 });
  }

  const placa = String((body as { placa: unknown }).placa)
    .replace(/[^a-zA-Z0-9]/g, "")
    .toUpperCase()
    .slice(0, 8);

  if (!PLACA_REGEX.test(placa)) {
    return NextResponse.json(
      { error: "Placa inválida. Use o formato ABC1234 ou ABC1D23 (Mercosul)." },
      { status: 400 }
    );
  }

  if (!PLACA_API_TOKEN) {
    // Serviço não configurado — retorna apenas a placa para preenchimento manual
    return NextResponse.json({ placa, configurado: false });
  }

  const resultado = await consultarPlaca(placa, PLACA_API_TOKEN);

  if (!resultado.ok) {
    return NextResponse.json({ error: resultado.error }, { status: resultado.status });
  }

  return NextResponse.json({ placa, configurado: true, ...resultado.data });
}
