"use client";

import { useRouter } from "next/navigation";
import {
  EmpresaForm,
  type EmpresaInitialData,
} from "@/app/configuracoes/empresa/_components/empresa-form";
import { sanitizarCpf } from "@/lib/utils/validators";

const EMPTY_INITIAL_DATA: EmpresaInitialData = {
  cnpj: "",
  nome_legal_empresa: "",
  nome_fantasia_empresa: "",
  inscricao_municipal: "",
  inscricao_estadual: "",
  telefone_principal: "",
  telefone_secundario: "",
  email_empresa: "",
  nome_representante: "",
  cargo_representante: "",
  telefone_representante: "",
  cep: "",
  logradouro: "",
  numero_logradouro: 0,
  complemento_logradouro: "",
  bairro: "",
  cidade: "",
  estado: "",
};

export function CadastroEmpresaStepForm() {
  const router = useRouter();

  return (
    <EmpresaForm
      mode="signup"
      initialData={EMPTY_INITIAL_DATA}
      onSubmitSignup={async ({ empresa, admin }) => {
        const cnpjDigits = empresa.cnpj.replace(/\D/g, "");
        const cpfDigits = sanitizarCpf(admin.cpf);

        sessionStorage.setItem(
          "signup:empresaBlock",
          JSON.stringify({
            empresa: {
              cnpj: cnpjDigits,
              inscricao_municipal: empresa.inscricao_municipal.trim(),
              inscricao_estadual: empresa.inscricao_estadual.trim(),
              nome_legal_empresa: empresa.nome_legal_empresa.trim(),
              nome_fantasia_empresa: empresa.nome_fantasia_empresa?.trim() || null,
              telefone_principal: empresa.telefone_principal?.replace(/\D/g, "") || null,
              telefone_secundario: empresa.telefone_secundario?.replace(/\D/g, "") || null,
              email_empresa: empresa.email_empresa?.trim().toLowerCase() || null,
              nome_representante: empresa.nome_representante.trim(),
              cargo_representante: empresa.cargo_representante.trim(),
              telefone_representante: empresa.telefone_representante?.replace(/\D/g, "") || null,
            },
            localizacao: {
              cep: empresa.cep.replace(/\D/g, ""),
              logradouro: empresa.logradouro.trim(),
              numero_logradouro: empresa.numero_logradouro,
              complemento_logradouro: empresa.complemento_logradouro?.trim() || null,
              bairro: empresa.bairro.trim(),
              cidade: empresa.cidade.trim(),
              estado: empresa.estado.trim().toUpperCase(),
            },
            admin: {
              nome_usuario: admin.nome.trim(),
              email_usuario: admin.email.trim().toLowerCase(),
              cpf: cpfDigits,
            },
          })
        );
        sessionStorage.setItem("signup:credentials", JSON.stringify({ senha: admin.senha }));
        router.push("/cadastro/resumo");
      }}
    />
  );
}
