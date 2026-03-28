"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string } | undefined;

// ─── Helper interno ───────────────────────────────────────────────────────────

async function getAdminAutorizado() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuarioAtual } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("id, empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuarioAtual?.empresa_id) redirect("/login");

  const papel =
    (usuarioAtual.papel as unknown as { nome_dominio: string } | null)
      ?.nome_dominio ?? "";

  if (papel !== "administrador") redirect("/dashboard");

  return { supabase, usuarioAtual };
}

// ─── Tipos do formulário ──────────────────────────────────────────────────────

export interface EmpresaPayload {
  // Empresa
  nome_legal_empresa: string;
  nome_fantasia_empresa: string | null;
  inscricao_municipal: string;
  inscricao_estadual: string;
  telefone_principal: string | null;
  telefone_secundario: string | null;
  email_empresa: string | null;
  nome_representante: string;
  cargo_representante: string;
  telefone_representante: string | null;
  // Localização
  cep: string;
  logradouro: string;
  numero_logradouro: number;
  complemento_logradouro: string | null;
  bairro: string;
  cidade: string;
  estado: string;
}

// ─── Validação server-side ────────────────────────────────────────────────────

function validarPayload(p: EmpresaPayload): ActionResult {
  if (!p.nome_legal_empresa.trim())
    return { error: "A razão social é obrigatória." };
  if (p.nome_legal_empresa.length > 255)
    return { error: "Razão social: máximo de 255 caracteres." };
  if (!p.inscricao_municipal.trim())
    return { error: "A inscrição municipal é obrigatória." };
  if (p.inscricao_municipal.length > 50)
    return { error: "Inscrição municipal: máximo de 50 caracteres." };
  if (!p.inscricao_estadual.trim())
    return { error: "A inscrição estadual é obrigatória." };
  if (p.inscricao_estadual.length > 50)
    return { error: "Inscrição estadual: máximo de 50 caracteres." };
  if (!p.nome_representante.trim())
    return { error: "O nome do representante é obrigatório." };
  if (p.nome_representante.length > 255)
    return { error: "Nome do representante: máximo de 255 caracteres." };
  if (!p.cargo_representante.trim())
    return { error: "O cargo do representante é obrigatório." };
  if (p.cargo_representante.length > 255)
    return { error: "Cargo do representante: máximo de 255 caracteres." };
  if (!p.logradouro.trim())
    return { error: "O logradouro é obrigatório." };
  if (p.logradouro.length > 100)
    return { error: "Logradouro: máximo de 100 caracteres." };
  if (!p.numero_logradouro || p.numero_logradouro <= 0)
    return { error: "O número do logradouro é obrigatório." };
  if (!p.bairro.trim())
    return { error: "O bairro é obrigatório." };
  if (p.bairro.length > 100)
    return { error: "Bairro: máximo de 100 caracteres." };
  if (!p.cidade.trim())
    return { error: "A cidade é obrigatória." };
  if (p.cidade.length > 50)
    return { error: "Cidade: máximo de 50 caracteres." };
  if (!p.estado.trim() || p.estado.length !== 2)
    return { error: "Informe o estado com 2 letras (UF)." };
  if (
    p.email_empresa &&
    p.email_empresa.trim() &&
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email_empresa.trim())
  )
    return { error: "E-mail da empresa inválido." };
}

// ─── Atualizar dados da empresa ───────────────────────────────────────────────

export async function atualizarEmpresa(
  payload: EmpresaPayload
): Promise<ActionResult> {
  const validationError = validarPayload(payload);
  if (validationError) return validationError;

  const { supabase, usuarioAtual } = await getAdminAutorizado();

  // Buscar localizacao_id atual da empresa
  const { data: empresa } = await supabase
    .schema("dealership")
    .from("empresa")
    .select("id, localizacao_id")
    .eq("id", usuarioAtual.empresa_id)
    .single();

  if (!empresa) return { error: "Empresa não encontrada." };

  // Atualizar localização
  const { error: locError } = await supabase
    .schema("dealership")
    .from("localizacao")
    .update({
      cep: payload.cep.replace(/\D/g, ""),
      logradouro: payload.logradouro.trim(),
      numero_logradouro: payload.numero_logradouro,
      complemento_logradouro: payload.complemento_logradouro?.trim() || null,
      bairro: payload.bairro.trim(),
      cidade: payload.cidade.trim(),
      estado: payload.estado.trim().toUpperCase(),
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", empresa.localizacao_id);

  if (locError) return { error: "Erro ao atualizar o endereço. Tente novamente." };

  // Atualizar empresa
  const { error: empError } = await supabase
    .schema("dealership")
    .from("empresa")
    .update({
      nome_legal_empresa: payload.nome_legal_empresa.trim(),
      nome_fantasia_empresa: payload.nome_fantasia_empresa?.trim() || null,
      inscricao_municipal: payload.inscricao_municipal.trim(),
      inscricao_estadual: payload.inscricao_estadual.trim(),
      telefone_principal: payload.telefone_principal?.replace(/\D/g, "") || null,
      telefone_secundario: payload.telefone_secundario?.replace(/\D/g, "") || null,
      email_empresa: payload.email_empresa?.trim().toLowerCase() || null,
      nome_representante: payload.nome_representante.trim(),
      cargo_representante: payload.cargo_representante.trim(),
      telefone_representante: payload.telefone_representante?.replace(/\D/g, "") || null,
      atualizado_em: new Date().toISOString(),
    })
    .eq("id", empresa.id);

  if (empError) return { error: "Erro ao atualizar os dados da empresa. Tente novamente." };

  revalidatePath("/configuracoes/empresa");
  redirect("/configuracoes/empresa?saved=1");
}
