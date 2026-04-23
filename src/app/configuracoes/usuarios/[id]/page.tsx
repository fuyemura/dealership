import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { atualizarUsuario, excluirUsuario } from "../actions";
import { UsuarioForm } from "../_components/usuario-form";

type Props = { params: Promise<{ id: string }> };

export default async function EditarUsuarioPage({ params }: Props) {
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

  // Somente administradores gerenciam usuários
  if (papel !== "administrador") redirect("/dashboard");

  // Busca o usuário garantindo isolamento por empresa
  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("id, auth_id, nome_usuario, email_usuario, cpf, papel_usuario_id")
    .eq("id", id)
    .eq("empresa_id", usuarioAtual.empresa_id)
    .single();

  if (!usuario) notFound();

  // Busca opções de papel
  const { data: papeis } = await supabase
    .schema("dealership")
    .from("dominio")
    .select("id, nome_dominio")
    .eq("grupo_dominio", "papel_usuario")
    .order("nome_dominio");

  const isSelf = usuario.id === usuarioAtual.id;

  // Vincula o id ao server action para evitar campos ocultos manipuláveis
  const updateAction = atualizarUsuario.bind(null, usuario.id);
  const deleteAction = excluirUsuario.bind(null, usuario.id);

  return (
    <UsuarioForm
      saveAction={updateAction}
      deleteAction={deleteAction}
      papeis={papeis ?? []}
      initialData={{
        nome_usuario: usuario.nome_usuario,
        email_usuario: usuario.email_usuario,
        cpf: usuario.cpf,
        papel_usuario_id: usuario.papel_usuario_id,
      }}
      isSelf={isSelf}
      isAdmin={true}
    />
  );
}
