import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ClienteForm } from "../_components/cliente-form";
import { atualizarCliente, excluirCliente } from "../actions";

export default async function EditarClientePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id, papel:dominio!papel_usuario_id(nome_dominio)")
    .eq("auth_id", user.id)
    .single();

  if (!usuario?.empresa_id) redirect("/login");

  const isAdmin =
    (usuario.papel as unknown as { nome_dominio: string } | null)
      ?.nome_dominio === "administrador";

  const { data: cliente } = await supabase
    .schema("dealership")
    .from("cliente")
    .select("id, nome_cliente, cpf, telefone_cliente, email_cliente")
    .eq("id", id)
    .eq("empresa_id", usuario.empresa_id)
    .single();

  if (!cliente) notFound();

  const saveAction = atualizarCliente.bind(null, id);
  const deleteAction = excluirCliente.bind(null, id);

  return (
    <ClienteForm
      saveAction={saveAction}
      deleteAction={isAdmin ? deleteAction : undefined}
      initialData={{
        id: cliente.id,
        nome_cliente: cliente.nome_cliente,
        cpf: cliente.cpf,
        telefone_cliente: cliente.telefone_cliente,
        email_cliente: cliente.email_cliente,
      }}
    />
  );
}
