import { redirect } from "next/navigation";

export const metadata = {
  title: "Escolha seu Plano — Uyemura Tech",
};

export default function CadastroPlanoPage() {
  redirect("/cadastro");
}
