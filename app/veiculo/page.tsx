import { criarClienteSupabaseServidor } from '@/lib/supabase/server'
import { Veiculo } from '@/types/database'
import CardVeiculo from '@/components/CardVeiculo'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function PaginaVeiculos() {
  const supabase = await criarClienteSupabaseServidor()
  
  const { data: veiculos, error } = await supabase
    .from('veiculos')
    .select('*')
    .order('criado_em', { ascending: false })

  if (error) {
    console.error('Erro ao buscar veículos:', error)
    return <div className="p-6">Erro ao carregar veículos</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Veículos</h1>
        <Link 
          href="/veiculos/novo"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Novo Veículo
        </Link>
      </div>

      {veiculos && veiculos.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {veiculos.map((veiculo: Veiculo) => (
            <CardVeiculo key={veiculo.id} veiculo={veiculo} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-500">
          Nenhum veículo cadastrado ainda.
        </div>
      )}
    </div>
  )
}