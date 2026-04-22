import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { criarDespesa } from "../actions";
import { DespesaForm } from "../_components/despesa-form";

function IconChevronLeft() {
  return (
    <svg width={16} height={16} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <path d="M15 18l-6-6 6-6" />
    </svg>
  );
}

function IconTag() {
  return (
    <svg width={22} height={22} viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
      <path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" />
      <line x1="7" y1="7" x2="7.01" y2="7" />
    </svg>
  );
}

export default async function NovaDespesaPage() {
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

  const { data: categorias } = await supabase
    .schema("dealership")
    .from("despesa_categoria")
    .select("id, nome")
    .eq("empresa_id", usuarioAtual.empresa_id)
    .order("nome", { ascending: true });

  if (!categorias || categorias.length === 0) {
    return (
      <div className="w-full max-w-2xl">
        <Link
          href="/financeiro/despesas"
          className="inline-flex items-center gap-1.5 text-sm text-brand-gray-text hover:text-brand-black transition-colors mb-6"
        >
          <IconChevronLeft /> Despesas
        </Link>

        <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black mb-8">
          Nova Despesa
        </h1>

        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft flex items-center justify-center mb-4 text-brand-gray-text">
            <IconTag />
          </div>
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            Nenhuma categoria cadastrada
          </h2>
          <p className="text-sm text-brand-gray-text max-w-xs mb-6">
            Crie ao menos uma categoria de despesa antes de registrar um
            lançamento.
          </p>
          <Link
            href="/financeiro/categorias/nova"
            className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
          >
            Criar categoria
          </Link>
        </section>
      </div>
    );
  }

  return (
    <DespesaForm
      categorias={categorias}
      saveAction={criarDespesa}
    />
  );
}
