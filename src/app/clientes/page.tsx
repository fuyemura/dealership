import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { formatCpf, formatTelefone, formatData } from "@/lib/utils/formatters";

// ─── Ícones ───────────────────────────────────────────────────────────────────

function IconPlus({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function IconArrowRight({ size = 14 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  );
}

function IconSearch({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
  );
}

function IconUsers({ size = 20 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}

// ─── Page (Server Component) ──────────────────────────────────────────────────

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: usuario } = await supabase
    .schema("dealership")
    .from("usuario")
    .select("empresa_id")
    .eq("auth_id", user.id)
    .single();

  if (!usuario?.empresa_id) redirect("/login");

  const empresaId = usuario.empresa_id;

  // ── Busca ────────────────────────────────────────────────────────────────────
  const { q: busca = "" } = await searchParams;
  const termoBusca = busca.trim();

  let query = supabase
    .schema("dealership")
    .from("cliente")
    .select("id, nome_cliente, cpf, telefone_cliente, email_cliente, criado_em")
    .eq("empresa_id", empresaId)
    .order("nome_cliente", { ascending: true });

  if (termoBusca) {
    // Busca por nome ou CPF: interpreta como CPF se tiver ao menos 6 dígitos
    const cpfDigitos = termoBusca.replace(/\D/g, "");
    if (cpfDigitos.length >= 6 && cpfDigitos === termoBusca.replace(/[.\-\s]/g, "")) {
      query = query.ilike("cpf", `%${cpfDigitos}%`);
    } else {
      query = query.ilike("nome_cliente", `%${termoBusca}%`);
    }
  }

  const { data: clientes } = await query;
  const lista = clientes ?? [];

  return (
    <>
      {/* Cabeçalho da página */}
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-brand-black">
            Clientes
          </h1>
          <p className="text-sm text-brand-gray-text mt-1">
            {lista.length}{" "}
            {lista.length === 1 ? "cliente cadastrado" : "clientes cadastrados"}
            {termoBusca && (
              <span className="ml-1">
                para &ldquo;<strong>{termoBusca}</strong>&rdquo;
              </span>
            )}
          </p>
        </div>
        <Link
          href="/clientes/novo"
          className="inline-flex items-center gap-2 self-start sm:self-auto rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
        >
          <IconPlus /> Novo Cliente
        </Link>
      </div>

      {/* Barra de pesquisa */}
      <form role="search" method="GET" action="/clientes" className="mb-6">
        <div className="relative max-w-sm">
          <div className="pointer-events-none absolute inset-y-0 left-3.5 flex items-center text-brand-gray-text">
            <IconSearch size={15} />
          </div>
          <input
            type="search"
            name="q"
            defaultValue={termoBusca}
            aria-label="Buscar clientes por nome ou CPF"
            placeholder="Buscar por nome ou CPF…"
            className="w-full rounded-xl border border-brand-gray-mid/60 bg-white pl-9 pr-4 py-2.5 text-sm text-brand-black placeholder:text-brand-gray-text/40 outline-none focus:ring-2 focus:ring-brand-black/10 focus:border-brand-black/40 transition-colors"
          />
        </div>
      </form>

      {/* Estado vazio */}
      {lista.length === 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 flex flex-col items-center justify-center py-16 px-6 text-center">
          <div className="w-12 h-12 rounded-2xl bg-brand-gray-soft flex items-center justify-center mb-4 text-brand-gray-text">
            <IconUsers size={22} />
          </div>
          <h2 className="font-display text-base font-semibold text-brand-black mb-1">
            {termoBusca ? "Nenhum cliente encontrado" : "Nenhum cliente cadastrado"}
          </h2>
          <p className="text-sm text-brand-gray-text max-w-xs mb-6">
            {termoBusca
              ? `Nenhum resultado para "${termoBusca}". Tente um nome ou CPF diferente.`
              : "Cadastre o primeiro cliente da empresa para começar."}
          </p>
          {!termoBusca && (
            <Link
              href="/clientes/novo"
              className="inline-flex items-center gap-2 rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2.5 hover:bg-brand-black/85 transition-colors"
            >
              <IconPlus /> Novo Cliente
            </Link>
          )}
        </section>
      )}

      {/* Tabela */}
      {lista.length > 0 && (
        <section className="bg-white rounded-2xl border border-brand-gray-mid/30 overflow-hidden">

          {/* Desktop */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-brand-gray-mid/20">
                  {["Nome", "CPF", "Telefone", "E-mail", "Cadastrado em", ""].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-xs font-semibold text-brand-gray-text uppercase tracking-wide whitespace-nowrap"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-brand-gray-mid/20">
                {lista.map((c) => (
                  <tr
                    key={c.id}
                    className="hover:bg-brand-gray-soft/50 transition-colors"
                  >
                    <td className="px-6 py-3.5 font-medium text-brand-black whitespace-nowrap">
                      {c.nome_cliente}
                    </td>
                    <td className="px-6 py-3.5 font-mono text-xs tracking-wider text-brand-gray-text whitespace-nowrap">
                      {formatCpf(c.cpf)}
                    </td>
                    <td className="px-6 py-3.5 text-brand-gray-text whitespace-nowrap">
                      {c.telefone_cliente ? formatTelefone(c.telefone_cliente) : (
                        <span className="text-brand-gray-text/40">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3.5 text-brand-gray-text">
                      {c.email_cliente ?? <span className="text-brand-gray-text/40">—</span>}
                    </td>
                    <td className="px-6 py-3.5 text-brand-gray-text whitespace-nowrap">
                      {formatData(c.criado_em)}
                    </td>
                    <td className="px-6 py-3.5 text-right">
                      <Link
                        href={`/clientes/${c.id}`}
                        className="inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity whitespace-nowrap"
                      >
                        Editar <IconArrowRight />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile: cards */}
          <div className="sm:hidden divide-y divide-brand-gray-mid/20">
            {lista.map((c) => (
              <div
                key={c.id}
                className="px-5 py-4 flex items-start justify-between gap-4"
              >
                <div className="flex flex-col gap-1 min-w-0">
                  <p className="text-sm font-medium text-brand-black truncate">
                    {c.nome_cliente}
                  </p>
                  <p className="font-mono text-xs tracking-wider text-brand-gray-text/70">
                    {formatCpf(c.cpf)}
                  </p>
                  {c.telefone_cliente && (
                    <p className="text-xs text-brand-gray-text">
                      {formatTelefone(c.telefone_cliente)}
                    </p>
                  )}
                  {c.email_cliente && (
                    <p className="text-xs text-brand-gray-text truncate">
                      {c.email_cliente}
                    </p>
                  )}
                  <p className="text-xs text-brand-gray-text">
                    Cadastrado em {formatData(c.criado_em)}
                  </p>
                </div>
                <Link
                  href={`/clientes/${c.id}`}
                  className="shrink-0 inline-flex items-center gap-1 text-xs font-medium text-brand-black hover:opacity-70 transition-opacity"
                >
                  Editar <IconArrowRight size={12} />
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
}


