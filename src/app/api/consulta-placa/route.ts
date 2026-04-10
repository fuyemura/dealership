import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { consultarPlaca } from "@/lib/utils/placa";

// Proxy server-side para consulta de dados de veículo por placa.
// Para trocar de provedor, edite apenas src/lib/utils/placa.ts.
// Configure a variável de ambiente PLACA_API_TOKEN para habilitar a integração.

const PLACA_API_TOKEN = process.env.PLACA_API_TOKEN ?? process.env.WDAPI_TOKEN;

const PLACA_REGEX = /^[A-Z]{3}[0-9]{4}$|^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;

export async function POST(request: NextRequest) {
  // Garante que apenas usuários autenticados utilizam este endpoint
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
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
