import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// Proxy server-side para consulta de dados de veículo por placa.
// Configure a variável de ambiente WDAPI_TOKEN para habilitar a integração.
// API utilizada: https://wdapi2.com.br/{PLACA}/{TOKEN}

const WDAPI_TOKEN = process.env.WDAPI_TOKEN;

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

  if (!WDAPI_TOKEN) {
    // Serviço não configurado — retorna apenas a placa para preenchimento manual
    return NextResponse.json({ placa, configurado: false });
  }

  try {
    const res = await fetch(`https://wdapi2.com.br/${placa}/${WDAPI_TOKEN}`, {
      cache: "no-store",
    });

    if (res.status === 404) {
      return NextResponse.json(
        { error: "Veículo não encontrado para esta placa." },
        { status: 404 }
      );
    }

    if (!res.ok) {
      return NextResponse.json(
        { error: "Erro ao consultar a placa. Tente novamente." },
        { status: 502 }
      );
    }

    const raw = await res.json();

    return NextResponse.json({
      placa,
      configurado: true,
      marca: raw.MARCA ?? null,
      modelo: raw.MODELO ?? null,
      ano_fabricacao: raw.ano ? Number(raw.ano) : null,
      ano_modelo: raw.anoModelo ? Number(raw.anoModelo) : null,
      cor: raw.cor ?? null,
      combustivel: raw.combustivel ?? null,
      renavam: raw.RENAVAM ?? null,
      chassi: raw.CHASSI ?? null,
      valor_fipe: raw.valor ?? null,
    });
  } catch {
    return NextResponse.json(
      { error: "Erro ao consultar a placa. Verifique sua conexão e tente novamente." },
      { status: 500 }
    );
  }
}
