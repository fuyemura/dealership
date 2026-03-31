import { ClienteForm } from "../_components/cliente-form";
import { criarCliente } from "../actions";

export default function NovoClientePage() {
  return <ClienteForm saveAction={criarCliente} />;
}
