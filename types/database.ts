export interface Veiculo {
  id: string
  loja_id: string
  marca: string
  modelo: string
  ano: number
  placa?: string
  cor?: string
  quilometragem?: number
  tipo_combustivel?: 'flex' | 'gasolina' | 'diesel' | 'eletrico' | 'hibrido'
  cambio?: 'manual' | 'automatico' | 'automatizado'
  descricao?: string
  preco?: number
  status: 'disponivel' | 'vendido' | 'reservado'
  criado_em: string
  atualizado_em: string
}

export interface VeiculoInsercao {
  loja_id: string
  marca: string
  modelo: string
  ano: number
  placa?: string
  cor?: string
  quilometragem?: number
  tipo_combustivel?: string
  cambio?: string
  descricao?: string
  preco?: number
}