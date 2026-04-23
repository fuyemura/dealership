import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { atualizarDespesa, excluirDespesa } from "../actions";
import { DespesaForm } from "../_components/despesa-form";
import { PAPEIS } from "@/lib/auth/roles";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditarDespesaPage({ params }: Props) {
  const { id } = await params;

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
  if (papel === "usuario") redirect("/dashboard");

  const isAdmin = papel === PAPEIS.ADMINISTRADOR.toLowerCase();

  // Busca a despesa (RLS já garante empresa)
  const { data: despesa } = await supabase
    .schema("dealership")
    .from("empresa_despesa")
    .select(
      "id, categoria_id, descricao, valor, data_despesa, recorrente, observacao"
    )
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!despesa) notFound();

  // Busca categorias
  const { data: categorias } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .select("id, nome")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .order("nome", { ascending: true });

  // Vincula o id às actions
  const saveAction    = atualizarDespesa.bind(null, id);
  const deleteAction  = excluirDespesa.bind(null, id);

  return (
    <DespesaForm
      categorias={categorias ?? []}
      saveAction={saveAction}
      deleteAction={isAdmin ? deleteAction : undefined}
      isAdmin={isAdmin}
      initialData={{
        categoria_id: despesa.categoria_id,
        descricao:    despesa.descricao,
        valor:        Number(despesa.valor),
        data_despesa: despesa.data_despesa,
        recorrente:   despesa.recorrente,
        observacao:   despesa.observacao ?? null,
      }}
    />
  );
}
