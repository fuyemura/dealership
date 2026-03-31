"use client";

import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

/**
 * Botão de logout — Client Component isolado.
 * Chama supabase.auth.signOut() no browser e redireciona para /login.
 * Mantido separado para não tornar a page inteira um Client Component.
 */
export default function SignOutButton() {
  const router = useRouter();

  async function handleSignOut() {
    const supabase = createClient();

    await supabase.auth.signOut();
    router.push("/login");
    router.refresh(); // limpa o cache do Router para apagar dados da sessão
  }

  return (
    <button
      onClick={handleSignOut}
      className="inline-flex items-center justify-center rounded-full bg-brand-black text-brand-white text-sm font-medium px-5 py-2 hover:bg-brand-black/85 transition-colors duration-150"
    >
      Sair
    </button>
  );
}
