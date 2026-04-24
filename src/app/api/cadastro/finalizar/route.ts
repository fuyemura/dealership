import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  finalizarCadastroBodySchema,
  type FinalizarCadastroBody,
} from "@/lib/cadastro/finalizar-cadastro-schema";

function buildRpcPayload(parsed: FinalizarCadastroBody, authId: string) {
  return {
    p_auth_id: authId,
    p_plano_id: parsed.planoId,
    p_admin: {
      email_usuario: parsed.admin.email_usuario,
      cpf: parsed.admin.cpf,
      nome_usuario: parsed.admin.nome_usuario.trim(),
    },
    p_empresa: {
      cnpj: parsed.empresa.cnpj,
      inscricao_municipal: parsed.empresa.inscricao_municipal.trim(),
      inscricao_estadual: parsed.empresa.inscricao_estadual.trim(),
      nome_legal_empresa: parsed.empresa.nome_legal_empresa.trim(),
      nome_fantasia_empresa: parsed.empresa.nome_fantasia_empresa?.trim() ?? "",
      telefone_principal: parsed.empresa.telefone_principal?.replace(/\D/g, "") ?? "",
      telefone_secundario: parsed.empresa.telefone_secundario?.replace(/\D/g, "") ?? "",
      email_empresa: parsed.empresa.email_empresa?.trim().toLowerCase() ?? "",
      nome_representante: parsed.empresa.nome_representante.trim(),
      cargo_representante: parsed.empresa.cargo_representante.trim(),
      telefone_representante: parsed.empresa.telefone_representante?.replace(/\D/g, "") ?? "",
    },
    p_localizacao: {
      cep: parsed.localizacao.cep,
      logradouro: parsed.localizacao.logradouro.trim(),
      numero_logradouro: String(parsed.localizacao.numero_logradouro),
      complemento_logradouro: parsed.localizacao.complemento_logradouro?.trim() ?? "",
      bairro: parsed.localizacao.bairro.trim(),
      cidade: parsed.localizacao.cidade.trim(),
      estado: parsed.localizacao.estado,
    },
    p_metodo_pagamento: {
      gateway_payment_method_id: parsed.metodo_pagamento.gateway_payment_method_id,
      bandeira_nome: parsed.metodo_pagamento.bandeira_nome,
      ultimos_quatro_digitos: parsed.metodo_pagamento.ultimos_quatro_digitos,
      mes_expiracao: String(parsed.metodo_pagamento.mes_expiracao),
      ano_expiracao: String(parsed.metodo_pagamento.ano_expiracao),
      nome_titular: parsed.metodo_pagamento.nome_titular.trim(),
    },
  };
}

export async function POST(req: Request) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corpo da requisição inválido." }, { status: 400 });
  }

  const parsed = finalizarCadastroBodySchema.safeParse(body);
  if (!parsed.success) {
    const msg = parsed.error.flatten().formErrors[0] ?? "Dados inválidos.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  const data = parsed.data;
  const admin = createAdminClient();
  let authUserId: string | null = null;

  try {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email: data.admin.email_usuario,
      password: data.senha,
      email_confirm: true,
    });

    if (createError || !created.user) {
      const msg = createError?.message ?? "Não foi possível criar o usuário.";
      const lower = msg.toLowerCase();
      if (lower.includes("already") || lower.includes("registered") || lower.includes("exists")) {
        return NextResponse.json(
          { error: "Já existe uma conta com este e-mail." },
          { status: 409 }
        );
      }
      return NextResponse.json({ error: msg }, { status: 400 });
    }

    authUserId = created.user.id;

    const rpcArgs = buildRpcPayload(data, authUserId);
    const { data: rpcData, error: rpcError } = await admin
      .schema("dealership")
      .rpc("finalizar_cadastro_signup", rpcArgs);

    if (rpcError) {
      await admin.auth.admin.deleteUser(authUserId);
      authUserId = null;

      const code = rpcError.code;
      const hint = rpcError.message ?? "";
      if (code === "23505") {
        if (hint.includes("uk_empresa_cnpj") || hint.toLowerCase().includes("cnpj")) {
          return NextResponse.json({ error: "Este CNPJ já está cadastrado." }, { status: 409 });
        }
        if (hint.includes("uk_usuario_cpf") || hint.toLowerCase().includes("cpf")) {
          return NextResponse.json({ error: "Este CPF já está cadastrado." }, { status: 409 });
        }
        if (hint.includes("email")) {
          return NextResponse.json({ error: "Este e-mail já está em uso." }, { status: 409 });
        }
        return NextResponse.json({ error: "Dados conflitantes com cadastro existente." }, { status: 409 });
      }

      if (code === "42883" || hint.includes("finalizar_cadastro_signup")) {
        return NextResponse.json(
          {
            error:
              "Serviço de cadastro indisponível. Aplique a migração SQL `07_finalizar_cadastro_signup.sql` no banco.",
          },
          { status: 503 }
        );
      }

      return NextResponse.json(
        { error: "Não foi possível concluir o cadastro. Tente novamente." },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, result: rpcData });
  } catch (e) {
    if (authUserId) {
      try {
        await createAdminClient().auth.admin.deleteUser(authUserId);
      } catch {
        /* best effort */
      }
    }
    console.error("finalizar cadastro:", e);
    return NextResponse.json({ error: "Erro interno ao processar o cadastro." }, { status: 500 });
  }
}
