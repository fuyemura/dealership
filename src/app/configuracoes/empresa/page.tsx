import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { EmpresaForm } from "./_components/empresa-form";
import { atualizarEmpresa } from "./actions";

export default async function EmpresaPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const { saved } = await searchParams;
  const savedOk = saved === "1";

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuarioAtual } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuarioAtual?.empresa_id) redirect("/login");

  const papel =
    (usuarioAtual.papel as unknown as { nome_dominio: string } | null)
      ?.nome_dominio?.toLowerCase() ?? "";

  if (papel !== "administrador") redirect("/dashboard");

  const { data: empresa } = await supabase
    .schema("dealership")
    .from("empresa")
    .select(
      `
      id,
      cnpj,
      inscricao_municipal,
      inscricao_estadual,
      nome_legal_empresa,
      nome_fantasia_empresa,
      telefone_principal,
      telefone_secundario,
      email_empresa,
      nome_representante,
      cargo_representante,
      telefone_representante,
      localizacao:localizacao_id (
        id,
        cep,
        logradouro,
        numero_logradouro,
        complemento_logradouro,
        bairro,
        cidade,
        estado
      )
    `
    )
    .eq("id", usuarioAtual.empresa_id)
    .single();

  if (!empresa) redirect("/dashboard");

  const loc = empresa.localizacao as unknown as {
    id: string;
    cep: string;
    logradouro: string;
    numero_logradouro: number;
    complemento_logradouro: string | null;
    bairro: string;
    cidade: string;
    estado: string;
  };

  const initialData = {
    cnpj: empresa.cnpj,
    nome_legal_empresa: empresa.nome_legal_empresa,
    nome_fantasia_empresa: empresa.nome_fantasia_empresa,
    inscricao_municipal: empresa.inscricao_municipal,
    inscricao_estadual: empresa.inscricao_estadual,
    telefone_principal: empresa.telefone_principal,
    telefone_secundario: empresa.telefone_secundario,
    email_empresa: empresa.email_empresa,
    nome_representante: empresa.nome_representante,
    cargo_representante: empresa.cargo_representante,
    telefone_representante: empresa.telefone_representante,
    cep: loc.cep,
    logradouro: loc.logradouro,
    numero_logradouro: loc.numero_logradouro,
    complemento_logradouro: loc.complemento_logradouro,
    bairro: loc.bairro,
    cidade: loc.cidade,
    estado: loc.estado,
  };

  return (
    <>
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Perfil da Empresa
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            Dados cadastrais, contato e endereço da revenda.
          </p>
        </div>
      </div>

      <EmpresaForm saveAction={atualizarEmpresa} initialData={initialData} savedOk={savedOk} />
    </>
  );
}
