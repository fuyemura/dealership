import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { atualizarCusto, excluirCusto } from "../actions";
import { CustoForm } from "../_components/custo-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditarCustoPage({ params }: Props) {
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

  // Busca o custo garantindo isolamento por empresa
  const { data: custo } = await supabase
    .schema("dealership")
    .from("veiculo_custo")
    .select("id, nome_custo, descricao")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!custo) notFound();

  // Vincula o id ao server action para evitar campos hidden manipuláveis
  const updateAction = atualizarCusto.bind(null, custo.id);
  const deleteAction = excluirCusto.bind(null, custo.id);

  return (
    <CustoForm
      saveAction={updateAction}
      deleteAction={isAdmin ? deleteAction : undefined}
      initialData={{
        nome_custo: custo.nome_custo,
        descricao: custo.descricao,
      }}
      isAdmin={isAdmin}
    />
  );
}
