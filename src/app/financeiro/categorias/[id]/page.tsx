import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { atualizarCategoria, excluirCategoria } from "../actions";
import { CategoriaForm } from "../_components/categoria-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditarCategoriaPage({ params }: Props) {
  const { id } = await params;

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
      ?.nome_dominio?.toLowerCase() ?? "";
  if (papel === "usuario") redirect("/dashboard");

  const isAdmin = papel === "administrador";

  const { data: categoria } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .select("id, nome, descricao")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!categoria) notFound();

  const updateAction = atualizarCategoria.bind(null, categoria.id);
  const deleteAction = excluirCategoria.bind(null, categoria.id);

  return (
    <CategoriaForm
      saveAction={updateAction}
      deleteAction={isAdmin ? deleteAction : undefined}
      initialData={{
        nome:      categoria.nome,
        descricao: categoria.descricao,
      }}
      isAdmin={isAdmin}
    />
  );
}
