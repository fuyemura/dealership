"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { getAdminAutorizado } from "@/lib/auth/guards";

export type ActionResult = { error: string } | undefined;


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
  const cepDigitos = p.cep.replace(/\D/g, "");
  if (!cepDigitos || cepDigitos.length !== 8)
    return { error: "CEP inválido. Informe 8 dígitos." };
  if (p.complemento_logradouro && p.complemento_logradouro.length > 100)
    return { error: "Complemento: máximo de 100 caracteres." };
  const telefoneDigitos = (t: string) => t.replace(/\D/g, "");
  if (p.telefone_principal && telefoneDigitos(p.telefone_principal).length > 11)
    return { error: "Telefone principal: máximo de 11 dígitos." };
  if (p.telefone_secundario && telefoneDigitos(p.telefone_secundario).length > 11)
    return { error: "Telefone secundário: máximo de 11 dígitos." };
  if (p.telefone_representante && telefoneDigitos(p.telefone_representante).length > 11)
    return { error: "Telefone do representante: máximo de 11 dígitos." };
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

  // Atualiza localização + empresa em uma única transação via RPC
  const { error: rpcError } = await supabase
    .schema("dealership")
    .rpc("atualizar_empresa_completa", {
      p_empresa_id:             usuarioAtual.empresa_id,
      // empresa
      p_nome_legal_empresa:     payload.nome_legal_empresa.trim(),
      p_nome_fantasia_empresa:  payload.nome_fantasia_empresa?.trim() || null,
      p_inscricao_municipal:    payload.inscricao_municipal.trim(),
      p_inscricao_estadual:     payload.inscricao_estadual.trim(),
      p_telefone_principal:     payload.telefone_principal?.replace(/\D/g, "") || null,
      p_telefone_secundario:    payload.telefone_secundario?.replace(/\D/g, "") || null,
      p_email_empresa:          payload.email_empresa?.trim().toLowerCase() || null,
      p_nome_representante:     payload.nome_representante.trim(),
      p_cargo_representante:    payload.cargo_representante.trim(),
      p_telefone_representante: payload.telefone_representante?.replace(/\D/g, "") || null,
      // localizacao
      p_cep:                    payload.cep.replace(/\D/g, ""),
      p_logradouro:             payload.logradouro.trim(),
      p_numero_logradouro:      payload.numero_logradouro,
      p_complemento_logradouro: payload.complemento_logradouro?.trim() || null,
      p_bairro:                 payload.bairro.trim(),
      p_cidade:                 payload.cidade.trim(),
      p_estado:                 payload.estado.trim().toUpperCase(),
    });

  if (rpcError) return { error: "Erro ao atualizar os dados da empresa. Tente novamente." };

  revalidatePath("/configuracoes/empresa");
  redirect("/configuracoes/empresa?saved=1");
}
